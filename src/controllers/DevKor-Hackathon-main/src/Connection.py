
class WebConnect:

    def getWinner(self, winner, csvList):
        for line in csvList:
            if line[1] == winner:
                return line[0]

    def sendRecommend(self, df, recList):
        output = []
        for rec in recList:
            row = df.loc[df['foodName'] == rec].values.tolist()[0]
            name = row[0]
            imgUrl = row[6]
            output.append([name, imgUrl])
        return output
    
    def toKor(self, csvList, foodName):
        
        for line in csvList:
            if line[0] == foodName:
                return line[1]

