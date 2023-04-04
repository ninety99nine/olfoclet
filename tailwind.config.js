/**
 *  Configure Flowbite
 *
 *  Reference: https://flowbite.com/docs/getting-started/quickstart/
 *
 *  I installed a package to enhance the group-* functionality for nested deeply nested children
 *  Issue Reference: https://github.com/tailwindlabs/tailwindcss/issues/1192
 *  Plugin used: https://github.com/onmax/tailwindcss-labeled-groups
 */
module.exports = {
    content: [
        "./node_modules/flowbite/**/*.js",  //  Added for Flowbite
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue"
    ],
    theme: {
        extend: {
            transitionProperty: {
                'height': 'height'
            }
        },
    },
    plugins: [
        require('flowbite/plugin'),     //  Added for Flowbite
        require('tailwindcss-labeled-groups')(['event-menu', 'repeat-navigation-menu'])   //  Added for enhancing group-* functionality
    ],
    variants: {
        // Now you can use named groups in textColor for hover and focus
        textColor: ["responsive", "hover", "focus", "group-hover", "group-focus"],
      },
    /**
     *  Running "npx mix watch" does some css tree shaking,
     *  and since classes generate on the fly are not
     *  included anywhere in the dom, they are not
     *  included in the final css build process.
     *  In this case we can list the classes
     *  that we need to also be included
     */
    safelist: ['col-span-12']
}
