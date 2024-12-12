import now from "./now.js";

class Clock {

    constructor(autoStart = false) {

        this.autoStart = autoStart;

        this.startTime = 0;
        this.oldTime = 0;
        this.elapsedTime = 0;

        this.running = false;

        if (autoStart)
            this.start();

    }

    start() {

        this.startTime = now();

        this.oldTime = this.startTime;
        this.elapsedTime = 0;
        this.running = true;

    }

    stop() {

        this.getElapsedTime();
        this.running = false;
        this.autoStart = false;

    }

    getElapsedTime() {

        this.getDelta();
        return this.elapsedTime;

    }

    getDeltaTime() {

        let diff = 0;

        if (!this.running) {

            this.start();
            return diff;

        }

        if (this.running) {

            const newTime = now();

            diff = (newTime - this.oldTime) / 1000;
            this.oldTime = newTime;

            this.elapsedTime += diff;

        }

        return diff;

    }

}

export default Clock;
