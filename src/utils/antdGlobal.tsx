import { notification, message, Modal, App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { NotificationInstance } from 'antd/es/notification/interface';
import type { HookAPI } from 'antd/es/modal/useModal';

let msg: MessageInstance = message;
let notify: NotificationInstance = notification;
let confirm: HookAPI = Modal as any; 

const GlobalAntdSetter = () => {
  const staticFunctions = App.useApp();
  msg = staticFunctions.message;
  notify = staticFunctions.notification;
  confirm = staticFunctions.modal;
  return null;
};

export { msg, notify, confirm };
export default GlobalAntdSetter;