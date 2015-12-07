var Remote = module.exports = function(spark)
{
    var _this = this;

    var knows = [];
    var handlers = {};

    var send = [];
    var send_timeout;

    spark.on('data', function(data)
    {
        if (typeof data === 'object')
        {
            var handler = handlers[data.q];
            if (typeof handler === 'function')
            {
                handler(data);
            }
        }
    });

    this.register_handler = function(method, callback)
    {
        handlers[method] = callback;
    };

    this.write = function(data)
    {
        send.push(data);
        if (typeof send_timeout === 'undefined')
        {
            send_timeout = setTimeout(function()
            {
                spark.write(send);
                send = [];
                send_timeout = undefined;
            }, 0);
        }
    };

    handlers.set = function(data)
    {
        var obj = PublicObject.get_obj(data.id);
        if (typeof obj !== 'undefined' && typeof obj.recv_prop === 'function')
        {
            obj.recv_prop(data.key, data.val);
        }
    };
};
