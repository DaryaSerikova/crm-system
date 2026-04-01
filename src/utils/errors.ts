import { notify } from './antdGlobal';
import type { IconType } from 'antd/es/notification/interface';

interface NotificationParams {
  title: string;
  description: string;
  type?: IconType;
}

export const openNotification = ({ title, description, type = 'info' }: NotificationParams) => {
  notify[type]({
    message: title,
    description: description,
    placement: 'topRight',
  });
};
