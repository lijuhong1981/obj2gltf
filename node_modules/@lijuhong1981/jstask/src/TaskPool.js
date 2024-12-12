import Check from '@lijuhong1981/jscheck/src/Check.js';
import isFunction from '@lijuhong1981/jscheck/src/isFunction.js';
import Destroyable from '@lijuhong1981/jsdestroy/src/Destroyable.js';
import AnimationFrameUpdater from './AnimationFrameUpdater.js';

let TaskId = 0;

function getNextTaskId() {
    return TaskId++;
}

const TaskState = Object.freeze({
    None: 0,
    Executing: 1,
    Finished: 2,
    Canceled: 3,
});

/**
 * 任务对象，需由子类继承实现
*/
class Task extends Destroyable {
    constructor(options = {}) {
        super();
        this.id = getNextTaskId();
        this.state = TaskState.None;
        this.priority = 0;
        if (isFunction(options.onExecute))
            this.onExecute = options.onExecute.bind(this);
        if (isFunction(options.onFinish))
            this.onFinish = options.onFinish.bind(this);
        if (isFunction(options.onCancel))
            this.onCancel = options.onCancel.bind(this);
    }

    execute() {
        if (this.isDestroyed() || this.isFinished || this.isCanceled || this.isExecuting) {
            console.warn('The id ' + this.id + ' task state is ' + this.state + ', unable do execute.');
            return false;
        }
        this.state = TaskState.Executing;
        this.onExecute();
        return true;
    }

    onExecute() { }

    get isExecuting() {
        return this.state === TaskState.Executing;
    }

    cancel() {
        if (this.isDestroyed() || this.isFinished)
            return false;
        this.state = TaskState.Canceled;
        this.onCancel();
        return true;
    }

    onCancel() { }

    get isCanceled() {
        return this.state === TaskState.Canceled;
    }

    finish() {
        if (this.isDestroyed())
            return false;
        this.state = TaskState.Finished;
        this.onFinish();
        return true;
    }

    onFinish() { }

    get isFinished() {
        return this.state === TaskState.Finished;
    }
};

/**
 * 任务池，用于管理任务的执行与销毁
 */
class TaskPool extends Destroyable {
    constructor(maximumNumber = 5) {
        super();
        //任务同时执行的最大数量
        this.maximumNumber = maximumNumber;
        //任务队列
        this.taskQueue = [];

        this.update = this.update.bind(this);
        // this.update();
        AnimationFrameUpdater.instance.add(this.update);
    }

    push(task) {
        Check.instanceOf('task', task, Task);
        this.taskQueue.push(task);
    }

    update() {
        if (this.isDestroyed())
            return;
        this.onUpdate();
    }

    onUpdate() {
        let executingCount = 0;
        const unexecuteTasks = [];
        const tasks = this.taskQueue.slice();
        tasks.forEach(task => {
            if (task.isFinished || task.isCanceled) { //移除掉已完成或已取消的任务
                const index = this.taskQueue.indexOf(task);
                if (index !== -1)
                    this.taskQueue.splice(index, 1);
                task.destroy();
            } else if (task.isExecuting) { //统计执行中的任务
                executingCount++;
            } else { //未执行的任务
                unexecuteTasks.push(task);
            }
        });

        let i = 0;
        while (executingCount < this.maximumNumber && i < unexecuteTasks.length) {
            const task = unexecuteTasks[i];
            if (task.execute())
                executingCount++;
            i++;
        }
    }

    /**
     * 执行销毁
     */
    onDestroy() {
        AnimationFrameUpdater.instance.remove(this.update);
        this.taskQueue.length = 0;
    }
};

let _instance;

Object.defineProperties(TaskPool, {
    instance: {
        configurable: false,
        get: function () {
            if (!_instance)
                _instance = new TaskPool();
            return _instance;
        }
    }
});

export {
    TaskPool,
    Task,
    TaskState,
};