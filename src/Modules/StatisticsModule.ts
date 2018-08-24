import jerzy from 'jerzy';
import jStat from 'jStat';
import levene from "levene-test";
import bf from "brown-forsythe-test";

class StatisticsModule {

    static pearsons(samples: number[][]): number {

        if (StatisticsModule.checkData(samples)) {
            const xs: number[] = samples[0];
            const ys: number[] = samples[1];
    
            if (xs.length === ys.length) {
                let sumY: number = 0;
                let sumY2: number = 0;
    
                let sumX: number = 0;
                let sumX2: number = 0;
    
                xs.forEach(e => {
                    sumX += e;
                    sumX2 += (e * e);
                });
    
                ys.forEach(e => {
                    sumY += e;
                    sumY2 += (e * e);
                });
    
                let sumXY = 0;
    
                const n: number = xs.length;
    
                for (var i = 0; i < n; ++i) {
                    sumXY += (xs[i] * ys[i]);
                }
    
                return (sumXY - (((sumX) * (sumY)) / n)) / (Math.sqrt(((sumX2 - ((Math.pow(sumX, 2)) / n))
                    * (sumY2 - ((Math.pow(sumY, 2)) / n)))));
            }
        }
        
        throw Error("Bad data passed to stats function.");
    }


    static anova(samples: number[][]): any {
        
        if (StatisticsModule.checkData(samples)) {
            const jObj = jStat(samples); // Convert our arrays into a jStat friendly collection.

            const fScore: number = jStat.anovafscore(jObj); // The f score from our ANOVA.
            const df1: number = samples.length - 1;
            let n: number = 0;
    
            for (let i = 0; i < samples.length; ++i) {
                n += samples[i].length;
            }
    
            const df2: number = n - df1 - 1;
    
            const pValue: number = 1 - jStat.centralF.cdf(fScore, df1, df2);
    
            return {
                "fScore": fScore,
                "pVal": pValue,
                "df1": df1,
                "df2": df2
            };
        }
        
        throw Error("Bad data passed to stats function.");
    }

    static shapiroWilk(sample: number[]): any {

        if (StatisticsModule.checkData(new Array(sample))) {
            const v: jerzy.Vector = new jerzy.Vector(sample);

            const result = jerzy.Normality.shapiroWilk(v);
    
            return result;
        }

        throw Error("Bad data passed to stats function.");
    }
    
    // Since we're already doing a Shapiro-Wilk test a Barlett's test would probably be
    // better but Levene's test has an npm library.
    static levene(samples: number[][]): any {

        if (StatisticsModule.checkData(samples)) {
            
            const chisqCDF = require('jStat').jStat.chisquare.cdf;
            
            const stat: number = levene.test(samples); // Get our T stat.

            const df: number = samples.length - 1; // Degrees of freedom is groups - 1;
            const pVal: number = 1 - chisqCDF(stat, df); // Get our p value;
        
            return {
                "T": stat,
                "df": df,
                "pVal": pVal
            };
        }

        throw Error("Bad data passed to stats function.");
    }

    static brownForsythe(samples: number[][]) {

        if (StatisticsModule.checkData(samples)) {
            const alpha: number = 0.05; // Our alpha value.
        
            const df1 = samples.length - 1;
            
            let df2: number = 0; // The count of all cases.
    
            samples.forEach(e => { // Count total cases.
                df2 += e.length;
            });
    
            const stat: number = bf.test(samples);
    
            const pVal: number = 1 - jStat.chisquare.cdf(stat, df1); // Get our p value;
            
            return pVal;
        }

        throw Error("Bad data passed to stats function.");
    }

    // Check to make sure we have no nulls or NaNs.
    private static checkData(samples: number[][]): boolean {

        if (samples !== null) { // Make sure array of samples is not null.
            for (let i = 0, len = samples.length; i < len; ++i) {
                const arr: number[] = samples[i]; 

                if (arr !== null) { // Make sure array of data is not null.
                    for (let j = 0, len = arr.length; j < len; ++j) {
                        const e: number = arr[j];

                        if (j === null) { // Make sure data value is not null.
                            return false;
                        }

                        else {
                            if (isNaN(j)) { // Make sure data value is not NaN.
                                return false;
                            }
                        }
                    }

                    return true; // All data was good.
                }
            }
        }

        return false;
    }
}

export default StatisticsModule;