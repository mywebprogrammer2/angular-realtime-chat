import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import Pusher from 'pusher-js';
import { AuthService } from 'src/app/auth/services/authService.service';
import { User } from 'src/app/dashboard/models/user.model';
import { BaseService } from 'src/app/services/base.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Message } from '../models/message.model';
import { dateStringToTimeAgo } from '../utils/dateStringToTimeAgo';
import { ContactsService } from './contacts.service';

declare const $: any;

@Injectable({
  providedIn: 'root',
})
export class ChatService extends BaseService<any> {
  private pusher: Pusher;
  channelName: any = 'private-chatify';
  channel: any;
  clientSendChannel: any;
  clientListenChannel: any;
  authUser: User | null;
  User: User | null;
  messengerId: number = 0;
  auth_id: number = 0;
  messages: Message[] = [];
  getMessageEmitter: BehaviorSubject<Message[]> = new BehaviorSubject<
    Message[]
  >([]);
  typingEmitter = new EventEmitter<boolean>();
  messengerUserEmitter: EventEmitter<User | null> = new EventEmitter();
  makeSeenEmitter: EventEmitter<boolean> = new EventEmitter();
  // Pagination
  total: number = 1;
  last_page: number = 1;
  last_message_id: number;

  //Subscriptions
  fetchMessagesSubscription: Subscription;

  protected getEndpoint(): string {
    return 'chatify'; // Provide the endpoint URL for roles
  }

  constructor(
    protected http: HttpClient,
    private storageService: StorageService,
    private authService: AuthService,
    private contactService: ContactsService
  ) {
    super();

    this.authUser = this.authService.getUser();

    this.auth_id = this.authUser?.id ? this.authUser?.id : 0;

    setInterval(() => {
      this.updateElementsDateToTimeAgo();
    }, 60000);
  }

  initializeServer() {
    this.initPusher();

    this.channel = this.pusher.subscribe(
      `${this.channelName}.${this.authUser?.id}`
    );

    this.clientListenChannel = this.pusher.subscribe(
      `${this.channelName}.${this.authUser?.id}`
    );

    // this.initClientChannel();

    this.bindChannels();
  }

  initPusher() {
    this.pusher = new Pusher(environment.pusher.key, {
      authEndpoint: environment.apiBaseUrl + '/chatify/chat/auth',
      cluster: environment.pusher.cluster,
      auth: {
        headers: {
          Authorization:
            'Bearer ' +
            this.storageService
              .read<string>('access_token')
              ?.replaceAll('"', ''),
        },
      },
    });
  }

  initClientChannel() {
    if (this.messengerId) {
      this.clientSendChannel = this.pusher.subscribe(
        `${this.channelName}.${this.messengerId}`
      );
    }
  }

  getMessengerId() {
    return this.messengerId;
  }

  setMessengerId(id: number) {
    this.messengerId = id;
    this.fetchMessages(id);
    if (this.messengerId > 0) {
      this.initClientChannel();
      this.makeSeen(true);
    }
  }

  setUser(user: User | null) {
    this.User = user;
    this.setMessengerId(this.User ? this.User.id : 0);
    this.contactService.setSeen(this.getMessengerId());
    this.messengerUserEmitter.next(this.User);
  }

  fetchMessages(id: number) {
    if (this.fetchMessagesSubscription) {
      this.fetchMessagesSubscription.unsubscribe();
    }

    this.fetchMessagesSubscription = this.post<any>('chatify/fetchMessages', {
      id: id,
    }).subscribe({
      next: (x) => {
        this.messages = x.messages;
        this.total = x.total;
        this.last_page = x.last_page;
        this.last_message_id = x.last_message_id;

        this.getMessageEmitter.next(this.messages);
      },
    });
  }

  sendMessage(files: File[], fields: any) {
    return this.uploadFile<any>(
      'chatify/sendMessage',
      files,
      { id: this.getMessengerId(), ...fields },
      ['file']
    );
  }

  bindChannels() {
    // Listen to messages, and append if data received
    this.channel.bind('messaging', (data: any) => {
      if (data.from_id == this.getMessengerId() && data.to_id == this.auth_id) {
        // $('.messages').find('.message-hint').remove();
        this.messages.push(data.message);
        this.getMessageEmitter.next(this.messages);
        // messagesContainer.find('.messages').append(data.message);
        // scrollToBottom(messagesContainer);
        this.makeSeen(true);
        // remove unseen counter for the user from the contacts list
        // $('.messenger-list-item[data-contact=' + this.getMessengerId() + ']')
        //   .find('tr>td>b')
        //   .remove();
      }

      this.contactService.updateLastMessage(data.from_id,data.message)


      this.playNotificationSound(
        'new_message',
        !(data.from_id == this.getMessengerId() && data.to_id == this.auth_id)
      );
    });

    // listen to typing indicator
    this.clientListenChannel.bind('client-typing', (data: any) => {
      if (data.from_id == this.getMessengerId() && data.to_id == this.auth_id) {
        this.typingEmitter.next(data.typing);
      }
      // scroll to bottom
      // scrollToBottom(messagesContainer);
    });

    // listen to seen event
    this.clientListenChannel.bind('client-seen', (data: any) => {
      if (data.from_id == this.getMessengerId() && data.to_id == this.auth_id) {
        if (data.seen == true) {
          console.log('Seen messages');
          // this.getMessageEmitter.emit(m);

          this.makeSeenEmitter.next(true);
        }
      }
    });

    // listen to contact item updates event
    this.clientListenChannel.bind('client-contactItem', (data: any) => {
      if (data.to == this.auth_id) {
        if (data.update) {
          this.contactService.updateContactItem(
            data.from,
            this.getMessengerId(),
            this.auth_id
          );
        } else {
          console.error('Can not update contact item!');
        }
      }
    });

    // listen on message delete event
    this.clientListenChannel.bind('client-messageDelete', (data: any) => {
      $('body').find(`.message-card[data-id=${data.id}]`).remove();
    });
    // listen on delete conversation event
    this.clientListenChannel.bind('client-deleteConversation', (data: any) => {
      if (data.from == this.getMessengerId() && data.to == this.auth_id) {
        this.messages = [];
        this.getMessageEmitter.next(this.messages);
      }
    });
    // -------------------------------------
    // presence channel [User Active Status]
    var activeStatusChannel = this.pusher.subscribe('presence-activeStatus');

    // Joined
    activeStatusChannel.bind('pusher:member_added', (member: any) => {
      this.setActiveStatus(1);
      this.contactService.setActive(member.id, true);
    });

    // Leaved
    activeStatusChannel.bind('pusher:member_removed', (member: User) => {
      this.setActiveStatus(0);
      this.contactService.setActive(member.id, false);
    });
  }

  playNotificationSound(soundName: string, condition = false) {
    if (document.hidden || condition) {
      const sound = new Audio();
      sound.src = 'assets/sounds/chatify/new-message-sound.mp3';
      sound.play();
    }
  }

  makeSeen(status: boolean) {
    if (document?.hidden) {
      return;
    }
    // remove unseen counter for the user from the contacts list
    // $(".messenger-list-item[data-contact=" + this.getMessengerId() + "]")
    //   .find("tr>td>b")
    //   .remove();
    // seen
    this.post('chatify/makeSeen', { id: this.getMessengerId() }).subscribe({
      next: () => {
        this.clientSendChannel.trigger('client-seen', {
          from_id: this.auth_id, // Me
          to_id: this.getMessengerId(), // Messenger
          seen: status,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   *-------------------------------------------------------------
   * Set Active status
   *-------------------------------------------------------------
   */
  setActiveStatus(status: number) {
    this.post('chatify/setActiveStatus', { status: status }).subscribe({
      next: (data: any) => {},
      error: (data: any) => {},
    });
  }

  /**
   *-------------------------------------------------------------
   * Trigger typing event
   *-------------------------------------------------------------
   */
  isTyping(status: boolean) {
    return this.clientSendChannel.trigger('client-typing', {
      from_id: this.auth_id, // Me
      to_id: this.getMessengerId(), // Messenger
      typing: status,
    });
  }

  /**
   *-------------------------------------------------------------
   * Trigger contact item updates
   *-------------------------------------------------------------
   */
  sendContactItemUpdates(status: boolean) {
    return this.clientSendChannel.trigger('client-contactItem', {
      from: this.auth_id, // Me
      to: this.getMessengerId(), // Messenger
      update: status,
    });
  }

  override deleteLocally(item: Message) {
    const index = this.messages.indexOf(item);
    if (index > -1) {
      this.messages.splice(index, 1);
      this.getMessageEmitter.next(this.messages);
    }
  }

  /**
   *-------------------------------------------------------------
   * Trigger delete conversation
   *-------------------------------------------------------------
   */
  sendDeleteConversationEvent() {
    return this.clientSendChannel.trigger('client-deleteConversation', {
      from: this.auth_id,
      to: this.getMessengerId(),
    });
  }

  updateSettings(files: File[], fields: {}) {
    return this.uploadFile('chatify/updateSettings', files, fields, ['avatar']);
  }

  deleteConversation() {
    return this.post('chatify/deleteConversation', {
      id: this.getMessengerId(),
    });
  }

  deleteConversationLocally() {
    this.messages = [];
    this.getMessageEmitter.next([]);
    this.sendContactItemUpdates(true);
  }

  updateElementsDateToTimeAgo() {
    let m = this.messages.map((x) => {
      x.timeAgo = dateStringToTimeAgo(x.created_at);
      return x;
    });
    this.messages = m;
    this.getMessageEmitter.next(this.messages);
  }

  destroy() {
    this.pusher.unbind_all();
    this.pusher.unsubscribe(`${this.channelName}.${this.authUser?.id}`);
  }
}
