"use strict";

var CarItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.no = obj.no;
		this.car_name = obj.car_name;
		this.borrower = obj.borrower;
	} else {
	    this.no = "";
        this.car_name = "";
        this.borrower = "";
	}
};

CarItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var CarLending = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new CarItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

CarLending.prototype = {
    init: function () {
        // todo
    },

    save: function (no, car_name) {

        no = no.trim();
        car_name = car_name.trim();
        if (no === "" || car_name === ""){
            throw new Error("book information error");
        }
        if (no.length > 64 || car_name.length > 64){
            throw new Error("car information exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var carItem = this.repo.get(no);
        if (carItem){
            throw new Error("car has been borrowed");
        }

        carItem = new CarItem();
        carItem.borrower = from;
        carItem.no = no;
        carItem.car_name = car_name;

        this.repo.put(no, carItem);
    },

    get: function (no) {
        no = no.trim();
        if ( no === "" ) {
            throw new Error("empty no")
        }
        return this.repo.get(no);
    }
};
module.exports = CarLending;