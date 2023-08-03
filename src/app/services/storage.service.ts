export class StorageService {
  write(key: string, value: any) {
      if (value) {
          value = JSON.stringify(value);
      }
      localStorage.setItem(key, value);
  }

  remove(key: string) {
      localStorage.removeItem(key);
  }

  read<T>(key: string): T | null {
      let value: string | null = localStorage.getItem(key);

      if (value && value != "undefined" && value != "null") {
          return <T>JSON.parse(value);
      }

      return null;
  }

  clear() : void {
      localStorage.clear();
  }
}
