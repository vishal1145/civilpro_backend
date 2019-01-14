

module.exports = function () {
    //setting default value
    this.Code = "P00001";
    this.Message = "Success";
    this.Data = null;

    this.getSuccessOutOut = function () {
        return this;
    };

    this.getErrorOutOut = function (code) {
        this.Code = code;
        this.Message = this.getMessageByCode(code); // "Get message from repo";
        this.Data = null;
        return this;
    };

    this.getMessageByCode = function (code) {
        var codes = [
            { Code: "ACC011", Text: "Link Expired" },
            { Code: "ACC013", Text: "Link Verified" },
            { Code: "ACC012", Text: "Link does't Exist" },
            { Code: "ACC001", Text: "Invalid username and password" },
            { Code: "ACC002", Text: "Email Id Already Exist" },
            { Code: "E00002", Text: "Second Message" },
            { Code: "POS001", Text: "Email Id Already Exist" },
            { Code: "UPD001", Text: "Error updating in record" },
            { Code: "PRC001", Text: "Process not defined  in the system" },
            { Code: "ACC005", Text: "Add Post operation failed." },
            { Code: "PRC002", Text: "Invalid username or password" },
            { Code: "PRE001", Text: "User does't Exist" },
            { Code: "PRE002", Text: "Enter data is not in correct format" },
            { Code: "ACC007", Text: "Incorrect refferal code" },
            { Code: "ACC008", Text: "Error in getting record" }
        ];

        var txt = "Unknown error code";
        for (var i = 0; i < codes.length; i++) {
            if (codes[i].Code == code) {
                txt = codes[i].Text;
                break;
            }
        }

        return txt;
    };

    this.wrapResponse = function (data, errorCode) {
        var toReturn = null;
        if (errorCode) {
            toReturn = this.getErrorOutOut(errorCode);
            toReturn.Data = null;
        } else {
            toReturn = this.getSuccessOutOut();
            toReturn.Data = data;
        }
        return toReturn;
    }

    this.generateUUID = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

}