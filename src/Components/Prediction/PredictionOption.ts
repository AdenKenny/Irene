import AbstractPrediction from "./AbstractPrediction";
import FinalPrediction from "./FinalPrediction";

class PredictionOption extends AbstractPrediction {
    
    constructor(word: String, next: AbstractPrediction[]) {
        super(word, next);
    }

    getOptions(word): String[] {
        if (word.length >= this.lowercase.length && word.substring(0, this.lowercase.length) === this.lowercase) {
            let w;
            if (this.lowercase.length === 0) {
                w = word;
            }
            else {
                w = word.substring(this.lowercase.length + 1, word.length);
            }
            let options: String[] = [];
            let found: boolean = false;
            this.next.forEach(n => {
                if (found === false) {
                    const o = n.getOptions(w);
                    if (o.length > 1) {
                        options = o;
                        found = true;
                    }
                    else {
                        options.push(o[0]);
                    }
                }
            });
            return options.map(option => {
                return this.word + (this.word.length === 0 ? "" : " ") + option;
            });
        }
        return [this.word + (this.word.length === 0 ? "" : " ")];
    }

    public add(options): void {
        this.next = this.next.concat(options);
    }

    public merge() : void {
        let i = 0;
        this.next = this.next.filter(n => {
            i++;
            for (let j = i; j < this.next.length; j++) {
                const other = this.next[j];
                if (n.word === other.word) {
                    other.next = other.next.concat(n.next);
                    return false;
                }
            }
            return true;
        });
        this.next.forEach(n => {n.merge();});
    }
    
    public reduce(): AbstractPrediction {
        for (let i = 0; i < this.next.length; i++) {
            this.next[i] = this.next[i].reduce();
        }
        if (this.next.length === 1) {
            const other = this.next[0];
            if (other instanceof FinalPrediction) {
                return new FinalPrediction(this.word + (this.word.length === 0 ? "" : " ") + other.word);
            }
            else {
                this.word = this.word + (this.word.length === 0 ? "" : " ") + other.word;
                this.next = other.next;
                this.lowercase = this.word.toLowerCase();
            }
        }
        return this;
    }

}

export default PredictionOption;