class timer {
    public status = false;
    public creation_date = new Date();
    private start_date;
    private end_date;

    public start = () => {
        this.status = true;
        this.start_date = new Date();
    };

    public stop = () => {
        this.status = false;
        this.end_date = new Date();
    };

    public getDuration = () => {
        return Math.abs(this.end_date - this.start_date);
    };

    public step = () => {
        const now = new Date();
        return Math.abs(now - this.start_date);
    };
}

export { timer };