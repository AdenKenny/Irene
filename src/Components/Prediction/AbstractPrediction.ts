abstract class AbstractPrediction {

    public lowercase;
    
    constructor(public word: String, public next: AbstractPrediction[]) {
        this.lowercase = this.word.toLowerCase();
    }

    abstract add(options): void;

    abstract getOptions(word: String): String[];

    abstract merge(): void;

    abstract reduce(): AbstractPrediction;
}

export default AbstractPrediction;