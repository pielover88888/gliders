var PublicObject = module.exports = {
    'create': function(obj, props)
    {
        var public_id = PublicObject._objs.length;
        PublicObject._objs.push(obj);
        obj.get_public_id = function() {return public_id;};

        var subscribers = [];
        var listeners = [];

        obj.send_prop = function(key)
        {
            for (var i = 0; i < subscribers.length; i++)
            {
                subscribers[i].write({
                    'q': 'set',
                    'id': public_id,
                    'key': key,
                    'val': props[key],
                });
            }
        };

        /*
        obj.send_all_props = function()
        {
            for (var i = 0; i < subscribers.length; i++)
            {
                subscribers[i].write({
                    'q': 'set_all',
                    'id': public_id,
                    'props': props,
                });
            }
        };
        */

        obj.recv_prop = function(key, val)
        {
            props[key] = val;
            for (var i = 0; i < listeners.length; i++)
            {
                listeners[i](key, val);
            }
        };

        /*
        obj.recv_all_props = function(new_props)
        {
            props = new_props;
            for (var i = 0; i < all_listeners.length; i++)
            {
                all_listeners[i](props);
            }
        };
        */

        obj.subscribe = function(remote)
        {
            subscribers.push(remote);
        };

        obj.listen_prop = function(callback)
        {
            listeners.push(callback);
        };
    },
    'get_obj': function(id)
    {
        return PublicObject._objs[id];
    },
};
var PublicObject._objs = [];
