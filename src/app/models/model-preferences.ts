export interface ModelPreferences {
    name : string,
    cover : string,
    picture : string,
    description : string,

    // about 
    personality_description : string,
    chatroom_show_description : string,
    turn_on_description : string,
    bad_mood_description : string,
    dream_customer_description : string,

    // schedule (pending)

    // General
    zodiac_sign : string,
    height : string,
    birth_date : string,
    weight : string,
    public_age : string,
    breast_size_number : number,
    public_country : string,
    breast_size_letter : string,
    language_spoken : string,
    breast_type : string,
    gender : string,
    hair_length : string,
    hair_color : string,
    shoe_size : string,
    public_hair : string,

    //  sexual preference
    orientation : string,

    // characteristics
    ethnicity : string,
    eyes : string,

    //Fetishes & specialities
    fetishes : Array<string>,
    wishlist : string,

    // color scheme
    text_color : string,
    background_color : string,

    // category
    category : Array<string>,

    // social media
    twitter : string,
    instagram : string   

}