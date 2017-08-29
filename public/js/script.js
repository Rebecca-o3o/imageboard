(function() {
    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll('template');

    Array.prototype.slice.call(templates).forEach(function(tmpl) {
        Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
    });

    Handlebars.partials = Handlebars.templates;


    //BACKBONE MODEL
    var HomeModel = Backbone.Model.extend({
        initialize: function() {
            this.fetch();
            console.log(this);
        },
        url: '/home'
    });
    var HomeModel = new HomeModel;

    //BACKBONE VIEW
    var HomeView = Backbone.View.extend({
        initialize: function() {
            var view = this;
            console.log(this);
            this.model.on('change', function() {
                view.render();
            });
        },
        render: function() {
            var data = this.model.toJSON();
            //ref to .html template id=images
            var html = Handlebars.templates.images(data);
            this.$el.html(html);
        }
    });

    //BACKBONE ROUTER
    var Router = Backbone.Router.extend({
        routes:{
            '*': 'home'
        }
    });

    var router = new Router;

    Backbone.history.start();

})();
