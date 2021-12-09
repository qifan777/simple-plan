/**
 * Model User
 */

export type User = {
  id: number;
  nickName: string;
  gender: string;
  phoneNumber: string;
  avatar: string | null;
  sysUserId: number;
  createdTime: Date;
  updatedTime: Date;
};

/**
 * Model Task
 */

export type Task = {
  taskId: number;
  title: string;
  description: string;
  checked: boolean;
  deadline: Date | null | string;
  remindTime: Date | null | string;
  appendix: string | null;
  userId: number;
  createdTime: Date | string;
  updatedTime: Date | string;
  listId: number;
  isSubscribe?: boolean;
  steps: Step[];
  leftTime?: number;
};

/**
 * Model Step
 */

export type Step = {
  stepId: number;
  content: string;
  checked: boolean;
  taskId: number;
  createdTime: Date;
  updatedTime: Date;
};

/**
 * Model List
 */

export type List = {
  listId: number;
  title: string;
  userId: number;
  createdTime?: Date;
  updatedTime?: Date;
  tasks?: Task[];
};

/**
 * Model TaskUser
 */

export type TaskUser = {
  id: number;
  taskId: number;
  userId: number;
  createdTime: Date;
  updatedTime: Date;
};

/**
 * Model ListTask
 */

export type ListTask = {
  id: number;
  taskId: number;
  listId: number;
  task: Task;
  list: List;
  createdTime: Date;
  updatedTime: Date;
};
interface myFile {
  name: string;
  path: string;
  status: string;
}
