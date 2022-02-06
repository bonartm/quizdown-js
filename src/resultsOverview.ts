export class ResultsOverview {
    public getOverallPoints(): number {
        let overallPoints: number = 0;
        for (let key of Object.keys(localStorage)) {
            if (key.endsWith('.score')) {
                overallPoints += parseInt(localStorage.getItem(key));
            }
        }
        console.log('overallPoints: ', overallPoints);
        return overallPoints;
    }

    public getOverallMaxPoints(): number {
        let overallMaxPoints: number = 0;
        for (let key of Object.keys(localStorage)) {
            if (key.endsWith('.maxScore')) {
                overallMaxPoints += parseInt(localStorage.getItem(key));
            }
        }
        console.log('overallMaxPoints: ', overallMaxPoints);
        return overallMaxPoints;
    }

    public getQuizesNames(): string[] {
        let quizesNames: string[] = [];
        
        for (let key of Object.keys(localStorage)) {
            if (key.endsWith('.score')) {
                quizesNames.push(key.split('.')[0]);
            }
        }
        console.log('quizesNames: ', quizesNames);
        return quizesNames;
    }
}