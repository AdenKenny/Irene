import AbstractPrediction from "./AbstractPrediction";

class FinalPrediction extends AbstractPrediction  {
    
    constructor(word: String) {
        super(word, []);
    }
    public add(options): void {}

    public getOptions(word: String): String[] {
        return [this.word];
    }

    public merge() : void {}
    
    public reduce(): AbstractPrediction {
        return this;
    }

}

export default FinalPrediction;