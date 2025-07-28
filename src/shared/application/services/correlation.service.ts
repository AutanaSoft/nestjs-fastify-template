// src/correlation/correlation.service.ts
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class CorrelationService {
  private readonly als = new AsyncLocalStorage<Map<string, string>>();

  run(callback: () => void) {
    this.als.run(new Map(), callback);
  }

  set(key: string, value: string) {
    const store = this.als.getStore();
    console.log('Store:', store);
    if (store) {
      store.set(key, value);
    }
    console.log(`Set ${key} to ${value} in correlation store`, store);
  }

  get(key: string): string | undefined {
    return this.als.getStore()?.get(key);
  }

  getCorrelationId(): string | undefined {
    console.log('Retrieving correlation ID', this.als.getStore());
    return this.get('correlationId');
  }
}
