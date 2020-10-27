/* ----------------------------------------------------------------------------------------------------
 * Messenger, 2020
 * Created: 29/04/20 by Bastien DIDIER
 * 
 * Messenger.js is a library for easily creating a chat interface and managing message generation
 *
 * Update: 25/07/20 Current V.0.2
 * ----------------------------------------------------------------------------------------------------
 */

class Messenger{

    /**
     * Create the Messenger HTML element
     * 
     * @param  {String}  options.container        default: body  Optional container for the messenger HTML element
     * @param  {Boolean} options.automaticScroll  default: true  Optional set automatic scroll when new message is append in the document
     * @param  {Int}     options.speed            default: 100   Optional speed of adding messages
     * 
     */
    constructor({container, automaticScroll, speed} = {container:"body", automaticScroll: true, speed:0}){
        
        //create the messenger container
        this.container = container;
        this.id = this.generateId("messenger");
        $(this.container).append(`<ul id="${this.id}" class="messenger"><li class="user sender receiver hidden"></li></ul>`);
        
        this.manager = new Manager();
        
        this.speed = speed; //TODO setter speed //Change speed to delay ?
        this.scrollSpeed = (this.speed > 100 ? this.speed - 50 : 50);

        this.automaticScroll = automaticScroll;

        this.remove = {
            loader: () => { //Give the possibility to remove the loader in the queue
                this.append(null);
            },
            message: (id) => {
                console.warn("Removing message isn't possible for the moment - id : "+id);
                //this.remove($("#"+id));
            }
        }
    }

    /** –––––––––––––––––––––––
     *        USER CLASS
     *  ––––––––––––––––––––––– */

    /**
     * Set user to Sender
     * @return {this}
     */
    get sender(){
        this.user = 'sender';
        return this;
    }

    /**
     * Set user to Receiver
     * @return {this}
     */
    get receiver(){
        this.user = 'receiver';
        return this;
    }

    /**
     * Set user to Application
     * @return {this}
     */
    get application(){
        this.user = 'application';
        return this;
    }

    /** –––––––––––––––––––––––
     *     MESSENGER SYSTEM
     *  ––––––––––––––––––––––– */

    /**
     * Put a message in the manager
     * 
     * @param  {String}   html               Final message element
     * @param  {String}   options.comment    Optional comment of the message
     * @param  {Function} options.callback   Optional callback when the message is append to the document
     * 
     */
    append(html, {comment, callback} = {comment: null, callback: null}){
        const message =  html ? this.surround(html+this.comment(comment)) : null;
        const self = this;
        this.manager.enqueue( () => {
            self.removeLoader();
            if(message){
                $('#'+self.id).append(message);
            }
            if(self.automaticScroll){
                self.smoothScroll();
            }
            if(callback instanceof Function){
                callback();
            }
        }, this.speed);
    }

    //TODO set speed
    //set speed(ms){
    //    this.speed = (ms < 100 ? 100 : ms);
    //    this.scrollSpeed = this.speed - 50;
    //}

    /**
     * Surround a message with a li element and the user class
     * 
     * @param  {String} msg  The HTML message content
     * 
     * @return {String}      A surrounded message
     * 
     */
    surround(msg){
        return `<li class="user ${this.user}">${msg}</li>`;
    }

    /**
     * Add a comment (or not)
     * 
     * @param  {String} comment Optional comment of the message
     * 
     * @return {String}         Comment HTML element
     * 
     */
    comment(comment){
        return ( comment != null ? `<p class="comment">${comment}</p>`:'')
    }

    /**
     * Scroll through html, body & the container each time a message is added
     */
    smoothScroll(){
        $('html, body, '+this.container).animate({ scrollTop: $(document).height() }, this.scrollSpeed);
    }

    /**
     * Generate an unique id
     * 
     * @return {String} generated id
     * 
     */
    generateId(string){
        let id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        if(string){
            while ($("#"+string+"-"+id).length) {
                console.warn("#"+string+"-"+id+" already exist");
                id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return string+"-"+id;        
        } else {
            return id;
        }        
    }

    /**
     * Remove a message
     * 
     * @param  {HTML Element} el
     * 
     */
    remove(el){
        $(el).parent().remove();
    }

    /**
     * Update a message
     * 
     * @param  {HTML Element}  el      Html element of the message to update
     * @param  {String}        type    Message type
     * @param  {String/Object} options Updated options
     * 
     */
    update(el, type, options, {comment, callback} = {comment: null, callback: null}){
        if(type == "text"){
            $(el).html(options);
            if(comment){
                $(el).parent().append(this.comment(comment));                
            }   
        } else {
            console.error("The type "+type+" isn't supported in the update methode");
        }
    }

    /**
     * /!\ SPEAK DEPRECATED
     * use update() instead
     * 
     * @param  {String} utterance User utterance
     * @param  {String} comment   Optional comment of the message
     * 
     */
    //speak(utterance, comment = null){
    //    if(this.senderSpeaking == false){
    //        this.senderSpeaking = true;
    //        this.text(utterance, {comment: comment});
    //    } else {
    //        //update utterance
    //        $('#'+this.id+' li.sender:last .content').html(utterance); //.text()
    //        if(comment){
    //            $('#'+this.id+' li.sender:last').append(this.comment(comment));
    //        }
    //    }
    //}

    /** –––––––––––––––––––––––
     *        MESSAGE TYPE
     *  ––––––––––––––––––––––– */

    /**
     * Create a text message
     * 
     * @param  {String}   content            Text content of the message
     * @param  {String}   options.comment    Optional comment of the message
     * @param  {Function} options.callback   Optional callback when the message is append to the document
     * 
     */
    text(content, {comment, callback} = {comment: null, callback: null}){
        const id = this.generateId("text");
        const text = `<p id="${id}" class="content">${content}</p>`
        this.append(
            text, 
            { 
                comment:comment,
                callback: () => {
                    if(callback instanceof Function){
                        return callback($('#'+id)[0]);
                    }
                }
            }
        );
    }

    /**
     * Create an image message
     * 
     * @param  {String}   src                Image path
     * @param  {String}   options.comment    Optional comment of the message
     * @param  {Function} options.callback   Optional callback when the message is append to the document
     * 
     */
    image(src, {comment, callback} = {comment: null, callback: null}){
        const id = this.generateId("image");
        const image = `<img id="${id}" src="${src}"/>`
        this.append(
            image, 
            { 
                comment:comment,
                callback: () => {
                    if(callback instanceof Function){
                        return callback($('#'+id)[0]);
                    }
                }
            }
        );
    }

    /**
     * Create a link message
     * 
     * @param  {String}   link.url          Link url path
     * @param  {String}   link.title        Link title
     * @param  {String}   link.source       Link source (ex: mentalista.fr)
     * @param  {String}   link.img          Optional link illustration
     * @param  {String}   options.comment   Optional comment of the message
     * @param  {Function} options.callback  Optional callback when the message is append to the document
     * 
     */
    link({url, title, source, img}, {comment, callback} = {comment: null, callback: null}){
        const id = this.generateId("link");
        const link =    `<div id="${id}" class="link">`+
                        `   <a href="${url}" target="_blank">`+
                        ( img != null ? `<img src="${img}">`:'')+
                        `       <div class="content">`+
                        `           <p class="source">${source}</p>`+
                        `           <p class="title">${title}</p>`+
                        `        </div>`+
                        `   </a>`+
                        `</div>`;
        this.append(
            link,
            {
                comment:comment,
                callback: () => {
                    if(callback instanceof Function){
                        return callback($('#'+id)[0]);
                    }
                }
            }
        );
    }

    /**
     * Create a card message
     * 
     * @param  {String}   card.title        Card title
     * @param  {String}   card.subtitle     Optional card subtitle
     * @param  {String}   card.description  Card description
     * @param  {String}   card.url          Optional card action link
     * @param  {String}   card.img          Optional card illustration
     * @param  {String}   options.comment   Optional comment of the message
     * @param  {Function} options.callback  Optional callback when the message is append to the document
     * 
     */
    card({title, subtitle, description, url, img}, {comment, callback} = {comment: null, callback: null}){
        const id = this.generateId("card");
        const card =    `<div id="${id}" class="card">`+
                        ( img != null ? `<img src="${img}">`:'')+
                        `   <div class="content${( url != null ? ' hasAction':'')}">`+
                        `       <p class="title">${title}</p>`+
                        ( subtitle != null ? `<p class="subtitle">${subtitle}</p>`:'')+
                        `       <p class="description">${description}</p>`+
                        `   </div>`+
                        ( url != null ? `<div class="action content">`+
                        `       <p><a href="${url}" target="_blank">En savoir plus</a></p>`+
                        `   </div>`:'')+
                        `</div>`;

        this.append(
            card,
            {
                comment:comment,
                callback: () => {
                    if(callback instanceof Function){
                        return callback($('#'+id)[0]);
                    }
                }
            }
        );
    }

    /**
     * Create a postal card message
     * 
     * @param  {String}   postal.title        Postal title
     * @param  {String}   postal.subtitle     Optional postal subtitle
     * @param  {String}   postal.description  Postal description
     * @param  {String}   postal.url          Optional postal action link
     * @param  {String}   postal.img          Optional postal illustration
     * @param  {String}   options.comment     Optional comment of the message
     * @param  {Function} options.callback    Optional callback when the message is append to the document
     * 
     */
    postal({title, subtitle, description, url, img}, {comment, callback} = {comment: null, callback: null}){
        const id = this.generateId("postal");
        const postal =  `<div id="${id}" class="postal">`+
                        `   <div class="content${( img != null ? ' hasImage':'')}">`+
                        `       <div>`+
                        `           <p class="title">${title}</p>`+
                        ( subtitle != null ? `<p class="subtitle">${subtitle}</p>`:'')+
                        `           <p class="description">${description}</p>`+
                        ( url != null ? `<p class="action"><a href="${url}" target="_blank">En savoir plus</a></p>` : '')+
                        `       </div>`+
                        ( img != null ? `<img src="${img}">`:'')+
                        `   </div>`+
                        `</div>`;

        this.append(
            postal,
            {
                comment:comment,
                callback: () => {
                    if(callback instanceof Function){
                        return callback($('#'+id)[0]);
                    }
                }
            }
        );
    }

    /**
     * Create a list message
     * 
     * @param  {String}   title              List title
     * @param  {Array}    items              List items as an array of objects
     * @param  {String}   options.comment    Optional comment of the message
     * @param  {Function} options.callback   Optional callback when the message is append to the document
     * 
     */
    list(title = null, items, {comment, callback} = {comment: null, callback: null}){

        let listEl = []; //TODO change variable name
        items.forEach(item => {
            listEl.push(this.listItem(item));
        });

        const id = this.generateId("list");
        const list =    `<div id="${id}" class="list">`+
                        `   <p class="title">${title}</p>`+
                        `   <ul>`+
                            listEl.join('')+
                        `   </ul>`+
                        `</div>`;

        this.append(
            list,
            {
                comment:comment,
                callback: () => {
                    if(callback instanceof Function){
                        return callback($('#'+id)[0]);
                    }
                }
            }
        );
    }

    /**
     * Create a list element
     * 
     * @param  {String} item.primary   Primary text
     * @param  {String} item.secondary Optional secondary text
     * @param  {String} item.img       Optional image path
     * 
     * @return {String}                Return list item html element
     * 
     */
    listItem({primary, secondary, img} = {secondary: null, img: null}){
        return `<li ${(img != null ? 'class="hasImage"':'')}>`+
        `   <div>`+
        `       <p class="primary">${primary}</p>`+
        ( secondary != null ? `<p class="secondary">${secondary}</p>` : '')+
        `   </div>`+
        ( img != null ? `   <img src="${img}">`:'')+
        `</li>`;
    }

    /**
     * Create a Carousel Message
     * 
     * @param  {Array}    items              Array of carousel item
     * @param  {String}   options.comment    Optional comment of the message
     * @param  {Function} options.callback   Optional callback when the message is append to the document
     * 
     */
    //carousel(items, {comment, callback} = {comment: null, callback: null}){

    //    let carouselEl = []; //TODO change variable name
    //    items.forEach(item => {
    //        carouselEl.push(this.carouselItem(item));
    //    });

    //    const id = this.generateId("carousel");
    //    const carousel =    `<div id="${id}" class="carousel">`+
    //                        `   <ul>`+
    //                            carouselEl.join('')+
    //                        `   </ul>`+
    //                        `</div>`;

    //    this.append(
    //        carousel,
    //        {
    //            comment:comment,
    //            callback: () => {
    //                if(callback instanceof Function){
    //                    return callback($('#'+id)[0]);
    //                }
    //            }
    //        }
    //    );
    //}

    /**
     * Create a Carousel Element
     * 
     * @param  {String} item.primary   Primary text
     * @param  {String} item.secondary Optional secondary text
     * @param  {String} item.img       Optional image path
     * 
     * @return {String}                Return carousel item html element
     * 
     */
    //carouselItem({primary, secondary, img} = {secondary: null, img: null}){
    //    return `<li class="carousel-item${(img != null ? ' hasImage':'')}">`+
    //    ( img != null ? `   <img src="${img}">`:'')+
    //    `   <div>`+
    //    `       <p class="primary">${primary}</p>`+
    //    ( secondary != null ? `     <p class="secondary">${secondary}</p>` : '')+
    //    `   </div>`+
    //    `</li>`;
    //}

    /**
     * Create an audio message
     * 
     * @param  {String}   src                Audio path
     * @param  {String}   options.comment    Optional comment of the message
     * @param  {Function} options.callback   Optional callback when the message is append to the document
     * 
     */
    audio(src, {comment, callback} = {comment: null, callback: null}){
        const id = this.generateId("audio");
        const audio =   `<audio id="${id}" controls="controls" preload="auto">`+
                        `    <source src="${src}" type="audio/mp3" />`+
                        `</audio>`;

        this.append(
            audio,
            {
                comment:comment,
                callback: () => {
                    if(callback instanceof Function){
                        return callback($("#"+id)[0]);
                    }
                }
            }
        );
    }

    /**
     * Create a youtube video message
     * 
     * @param  {String}   src                Youtube video embedded path
     * @param  {String}   options.comment    Optional comment of the message
     * @param  {Function} options.callback   Optional callback when the message is append to the document
     * 
     */
    video(src, {comment, callback} = {comment: null, callback: null}){
        const id = this.generateId("video");
        const iframe =  `<div id="${id}" class="video">`+
                        `   <iframe width="560" height="315" src="${src}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`+
                        `</div>`;
        this.append(
            iframe,
            {
                comment:comment,
                callback: () => {
                    if(callback instanceof Function){
                        return callback($('#'+id)[0]);
                    }
                }
            }
        );
    }

    /**
     * Create an empty canvas message
     * 
     * @param  {String}   options.comment    Optional comment of the message
     * @param  {Function} options.callback   Optional callback when the message is append to the document
     * 
     */
    canvas({comment, callback} = {comment: null, callback: null}){
        const id = this.generateId("canvas");
        const canvas = `<canvas id="${id}" width="560" height="315"></canvas>`;
        this.append(
            canvas,
            {
                comment:comment,
                callback: () => {
                    if(callback instanceof Function){
                        const el = $('#'+id)[0];
                        const ctx = el.getContext('2d');
                        return callback(el, ctx);
                    }
                }
            }
        );
    }

    /**
     * Create a webcam message
     * 
     * @param  {String}   options.comment    Optional comment of the message
     * @param  {Function} options.callback   Optional callback when the message is append to the document
     * 
     */
    webcam({comment, callback} = {comment: null, callback: null}){
        const id = this.generateId("webcam");
        const webcam =  '<video id="'+id+'" autoplay="true" width="400" height="300"></video>'+
                        '<div class="webcam-button" id="button-'+id+'"></div>';
        this.append(
            webcam,
            {
               comment:comment,
                callback: () => {
                    if(callback instanceof Function){
                        const videoEl = $('#'+id)[0];
                        const buttonEl = $("#button-"+id)[0];

                        let localStream;
                        if (navigator.mediaDevices.getUserMedia) {
                            navigator.mediaDevices.getUserMedia({ video: true })
                            .then(function (stream) {
                              videoEl.srcObject = stream;
                              localStream = stream;
                              return callback(videoEl, localStream, buttonEl);
                            })
                            .catch(function (error) {
                              console.error(error);
                            });
                        }
                    }
                } 
            }
        );
    }

    //TODO
    /**
     * Create a image message from a video element
     * 
     * @param  {Html element} video
     * 
     */
    snapshoot(video){
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        canvas.getContext('2d').drawImage(video, -50, 0, 400, 300);
        this.image(canvas.toDataURL());
    }

    /**
     * Show loading message
     */
    loader(){
        this.append(
            '<div id="'+this.user+'-loader" class="content loader">'+
            '    <div class="loader-dots">'+
            '        <div class="loader-dot"></div>'+
            '        <div class="loader-dot"></div>'+
            '        <div class="loader-dot"></div>'+
            '    </div>'+
            '</div>'
        );
    }

    /**
     * Remove loading message
     */
    removeLoader(){
        $('#'+this.user+'-loader').parent().remove();
    }
}

/**
 * Manages tasks and time between each
 */
class Manager {

    constructor(){
        this.timer;
        this.items = []; 
    } 
    
    /**
     * Add an element in the waiting queue
     * 
     * @param  {Function} callback Function to call when task is launch
     * @param  {Int}      delay    Time to wait before launching this task
     * 
     */
    enqueue(callback, delay){
        this.items.push({callback: callback, delay: delay});
        if(this.timer) return;
        this.launch();
    };

    /**
     * delete the first element
     * 
     * @return {Item} Return next and element and dequeue it
     * 
     */
    dequeue(){
        return this.items.shift();
    };

    /**
     * Remove particulare item
     * 
     * @param  {Int} i index of an item
     * 
     */
    remove(i){
        delete this.items[i];
    }

    /**
     * Clear the queu and the timer
     * 
     */
    clear(){
        if (this.timer) clearTimeout(this.timer);
        this.timer = null;
        this.items.length = 0;
    }

    /**
     * Check if the queue is empty
     * 
     * @return {Boolean}
     * 
     */
    isEmpty(){
        return this.items.length == 0;
    };
    
    /**
     * Take the next task
     * 
     * @return {Item} If the task queu isn't empty retrun the next item
     * 
     */
    next() { 
        return !this.isEmpty() ? this.items[0] : undefined;
    };

    /**
     * Check how many task to go
     * 
     * @return {Int} return how many items to go
     * 
     */
    length() {
        return this.items.length;
    }

    /**
     * Lauch first task
     * 
     */
    launch() {
        if(this.timer) return;

        let task = this.dequeue();
        
        if(!task) return this.clear();

        var self = this;
        this.timer = setTimeout(function(){
            task.callback.call();
            self.timer = null;
            self.launch();
        }, task.delay);
    }

    /**
     * Log items
     * 
     * @return {Items array} Return all items to go
     * 
     */
    print(){
        return !this.isEmpty() ? this.items : undefined;
    }
}