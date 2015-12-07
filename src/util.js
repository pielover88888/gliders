var Util = {
    'add_callback': function(obj, key, new_callback)
    {
        if (typeof obj[key] === 'function')
        {
            var cur_callback = obj[key];
            obj[key] = function()
            {
                cur_callback.apply(this, arguments);
                new_callback.apply(this, arguments);
            };
        }
        else
        {
            obj[key] = new_callback;
        }
    },
};
