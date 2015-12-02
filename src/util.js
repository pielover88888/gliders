var Util = {
    'add_callback': function(obj, key, callback)
    {
        if (typeof obj[key] === 'function')
        {
            var cur_callback = obj[key];
            obj[key] = function()
            {
                cur_callback();
                callback();
            };
        }
        else
        {
            obj[key] = callback;
        }
    },
};
