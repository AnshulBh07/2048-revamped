interface IStack<T> {
  push(data: T): void; //pushes at top
  pop(): void; //pops last ele
  peek(): T; //gives top element
  isEmpty(): boolean; //checks if empty
  size(): number; //gives size
  clear(): void; //clears stack
}

class Stack<T> implements IStack<T> {
  private storage: T[];
  private capacity: number;

  constructor() {
    this.capacity = Infinity;
    this.storage = [];
  }

  public size(): number {
    return this.storage.length;
  }

  public isEmpty(): boolean {
    return this.storage.length === 0;
  }

  public push(data: T): void {
    if (this.storage.length === this.capacity) {
      throw new Error("Stack is full!");
    }
    // push at the end of array as it represents bottom
    this.storage.push(data);
  }

  public pop(): void {
    if (this.storage.length === 0) {
      throw new Error("Stack is empty!");
    }
    // pop at the end of array as it represents top
    this.storage.pop();
  }

  public peek(): T {
    if (this.storage.length === 0) {
      throw new Error("Stack is empty!");
    }

    return this.storage[this.storage.length - 1];
  }

  public clear(): void {
    this.storage = [];
    this.capacity = Infinity;
  }
}

export default Stack;
