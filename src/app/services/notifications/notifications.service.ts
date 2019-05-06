import { Injectable, EventEmitter } from '@angular/core';

/** Operates with displaying notifications */
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  /** Current message */
  message = '';
  /** Current message timeout identifier */
  private messageTimeoutId_;
  /** Trailing dots timeout id */
  private trailingDotsTimeoutId_;
  /** Iteration number */
  private trailingDotsIteration_;
  /** Emits on message change */
  messageChange = new EventEmitter<string>();
  /**
   * [DEPRECATED] Use show() instead.
   * Show a new message.
   * New message overrides the former one.
   * @param msg message to display
   * @param timeout message displaying time
   * @param persistent identifies if message should stay persistent.
   *    This function omits timeout in case persistent=true
   */
  showMessage(msg: string, timeout = 3000, persistent = false) {
    clearInterval(this.trailingDotsTimeoutId_);

    this.message = msg;
    this.messageChange.emit(msg);
    if (this.messageTimeoutId_) 
      clearTimeout(this.messageTimeoutId_);
    if (!persistent)
      this.messageTimeoutId_ = setTimeout(() => {
        this.message = '';
        this.messageChange.emit('');
        clearInterval(this.trailingDotsTimeoutId_);
      }, timeout);
  }

 /**
  * Show a new message.
  * New message overrides the former one.
  * @param options show options
  */
  show(message, { timeout = 3000, isPersistent = false, isLoading = false }) {
    // Cleaer isLoading effect
    clearInterval(this.trailingDotsTimeoutId_);
    // Change message
    this.message = message;
    // Setup trailing dots interval
    if (isLoading) {
      this.trailingDotsIteration_ = 0;
      this.trailingDotsTimeoutId_ = setInterval(() => {
        this.message = message + '.'.repeat(this.trailingDotsIteration_++ % 4);
        this.messageChange.emit(this.message);
      }, 500);
    }
    // Emit message change
    this.messageChange.emit(message);
    // Clear previous display timeout
    if (this.messageTimeoutId_)
      clearTimeout(this.messageTimeoutId_);
    // Setup new display timeout
    if (!isPersistent)
      this.messageTimeoutId_ = setTimeout(() => {
        clearInterval(this.trailingDotsTimeoutId_);
        this.message = '';
        this.messageChange.emit('');
      }, timeout);
  }
}
