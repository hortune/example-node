
module.exports = {
    user: {
        name: { type: String, required: true },
        password: { type: String, required: true },
        buyedItems: {type: Array, default: []}
    },
    commodity: {
        name: String,
        score: Number,
        imgSrc: String,
        amount: Number,
        cStatus : { type: Boolean, default: false}
    },
    cart:{
        uId: { type: String },
        cId: { type: String },
        cName: { type: String },
        cScore: { type: String },
        cImgSrc: { type:String } ,
        cQuantity: { type: Number },
        cStatus : { type: Boolean, default: false  }
    }
};
