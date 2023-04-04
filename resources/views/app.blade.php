<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link href="{{ mix('/css/app.css') }}" rel="stylesheet" />

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
    <link rel="manifest" href="/favicon/site.webmanifest">
    <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <!--
        The @-routes below is used for ziggy support
        Reference 1: https://github.com/tighten/ziggy
        Reference 2: https://www.magutti.com/blog/install-ziggy-on-laravel-8-and-vue-3

        It must be imported before the application's JavaScript
    -->
    @routes

    <!-- Application's JavaScript -->
    <script src="{{ mix('/js/vendor.js') }}" defer></script>
    <script src="{{ mix('/js/manifest.js') }}" defer></script>
    <script src="{{ mix('/js/app.js') }}" defer></script>
    <script src="{{ mix('/js/flowbite.js') }}" defer></script>

    <!--
        The @-inertiaHead below is used for inertia support
    -->
    @inertiaHead

  </head>
  <body class="bg-gray-100">
    @inertia
  </body>
</html>
