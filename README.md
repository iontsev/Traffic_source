# Traffic source

## The simple script for determining the traffic source
The “_traffic-source.js_” script collects data about the traffic source, generates a label based on it, and stores received data in the cookies. Then it passes the data as the second parameter to the function specified in the “_message_” option of the config.

The traffic source data is encoded for storage in the cookies using the Caesar cipher version. The phrase specified in the “_pattern_” option of the config is used as the encryption key. Protection is not strong, but sufficient.

The traffic source label is generated as follows:

1. If the address has GET parameters specified in the “_general_” field of the “_limiter_” option, their values ​​are joined trough the “_||_” as a delimiter and are recorded in the “_header_” part of the cookie. The referrer is recorded in the “_source_” part. The address is recorded in the “_target_” part.

2. If the address has GET parameters specified in the “_general_” field of the “_limiter_” option, the cookies are checked for the label. If this visit is not first, and the source label was saved early, the script uses the label value from the cookies.

3. If the address has not GET parameters specified in the “_general_” field of the “_limiter_” option and the cookies have not the source label, the address is checked for GET parameters specified in the “_special_” field of the “_limiter_” option. If found, their values ​​are joined through “_||_” as a delimiter and are recorded in the “_header_” part of the cookie. The referrer is recorded in the “_source_” part. The address is recorded in the “_target_” part.

4. If the address has not GET parameters specified in the “_general_” or “_special_” fields of the “_limiter_” option and the cookies have not the source label,  the “...” value is recorded in the “_header_” part of the cookie. The referrer is recorded in the “_source_” part. The address is recorded in the “_target_” part.

The script has the following parameters at startup:

+ __subject__ — the name of cookie for store the traffic source data. The current value is “_>>>”.
+ __limiter__ — the general and special lists of GET parameters for sending the traffic source labels. The current values of the general list: “src”.  The current values of special list: “utm_source”, “utm_medium”, “utm_campaign”, “utm_content”, “utm_term”.
+ __pattern__ — the text for encoding the traffic source data. The current value is “// Replace traffic source!”.
+ __message__ — the function for using the traffic source data. The current function adds the source label and the referer in the “dataLayer” array.

The example configuration for this script:

    {
        'subject': '_>>>',  // the cookie name for store the traffic source data
        'limiter': {
            'general': ['src'],  // the general list of GET parameters for sending the traffic source labels
            'special': ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']  // the special list of GET parameters
        },
        'pattern': '// Replace traffic source!',  // the text for encoding the traffic source data
        'message': function (subject, variant) {  // the function for using the traffic source data
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'place_type_event',
                'place_type_title': variant.header,
                'place_type_value': variant.source
            });

            return true;  // “true” is signal that the function worked without errors
        }
    }
