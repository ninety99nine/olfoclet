<template>

    <div>

        <!-- Search Bar -->
        <DefaultSearchBar v-model="searchTerm" placeholder="Search" :totalResults="totalResults" class="mb-4" />

        <!-- Explainer -->
        <PrimaryAlert class="mb-4">
            <span class="text-justify">
                Review services and methods available to the <span class="font-semibold text-blue-500">AppWrite</span> Code Editor
            </span>
        </PrimaryAlert>

        <div>

            <div v-for="(api, index) in apis" :key="index" @click="handleSelectedMethod(index)">

                <div :class="['border border-gray-300 shadow-sm p-4 mb-2 rounded-md cursor-pointer', api.selected ? 'bg-blue-50' : 'hover:bg-gray-50']">

                    <h1 class="flex items-center justify-between text-md font-semibold text-gray-800 mb-2">

                        <!-- Name -->
                        <span class="mr-2">{{ api.name }}</span>

                        <!-- Link -->
                        <div class="flex items-center group">
                            <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 group-hover:text-blue-600 h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <a @click.stop="" :href="api.link" target="_blank" class="block text-xs text-blue-500 group-hover:text-blue-600 hover:underline">Read Docs</a>
                        </div>

                    </h1>

                    <h2 class="text-xs text-gray-500 mb-2">{{ api.description }}</h2>

                    <div>
                        <span class="mr-2">📌</span>
                        <span v-if="api.totalResults == 0" class="text-blue-500 font-bold text-xs">No Methods</span>
                        <span v-else class="text-blue-500 font-bold text-xs">Found {{ api.totalResults }} {{ api.totalResults == 1 ? ' Method' : ' Methods' }}</span>
                    </div>

                </div>

                <!-- Methods -->
                <SlideUpDown v-model="api.selected" :duration="500" class="border-l border-dotted border-gray-400 ml-2 pl-4">

                    <div v-for="(method, index2) in api.availableMethods" :key="index2">
                        <div v-if="searchIndexes[index].includes(index2)" @click.stop="copyToClipboard(index, index2)"
                            class="group bg-gray-50 hover:bg-gray-100 hover:shadow-md border border-white hover:border-gray-300 shadow-sm p-4 mb-2 rounded-md cursor-pointer relative">

                            <!-- Copy To Clipboard -->
                            <CopyToClipboard :ref="'clipboard-'+index+'-'+index2" :value="method.code" message="Method Copied" class="absolute right-2"></CopyToClipboard>

                            <!-- Name -->
                            <div class="inline-flex items-center mb-2">
                                <div class="flex font-bold items-center bg-gray-200 text-gray-900 text-xs rounded-full mr-2 py-1 px-2">{{ index2 + 1 }}</div>
                                <h1 class="text-sm font-semibold text-gray-800">{{ method.name }}</h1>
                            </div>

                            <!-- Description -->
                            <p class="text-xs text-gray-500 group-hover:text-gray-600 mb-2">{{ method.description }}</p>

                            <!-- Link -->
                            <div class="absolute right-4 bottom-4 flex items-center group">
                                <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 group-hover:text-blue-600 h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <a :href="method.link" target="_blank" class="block text-xs text-blue-500 group-hover:text-blue-600 hover:underline">Read Docs</a>
                            </div>

                            <!-- Code Snippet -->
                            <DefaultCodeSnippet>{{ method.code }}</DefaultCodeSnippet>

                        </div>
                    </div>

                </SlideUpDown>

                <!-- No Methods -->
                <div v-if="api.hasResults == false" class="flex items-center bg-gray-50 p-8">
                    <span class="text-gray-500 text-xs">No Methods</span>
                </div>

            </div>

        </div>


    </div>

</template>

<script>

    import SlideUpDown from 'vue3-slide-up-down';
    import CopyToClipboard from '@components/CopyToClipboard';
    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
    import DefaultCodeSnippet from "@components/CodeSnippet/DefaultCodeSnippet";

    export default {
        props: ['form'],
        components: { SlideUpDown, CopyToClipboard, PrimaryAlert, DefaultSearchBar, DefaultCodeSnippet },
        data(){
            return {
                apis: [
                    {
                        selected: false,
                        totalResults: 0,
                        hasResults: true,
                        name: 'Users API',
                        link: 'https://appwrite.io/docs/server/users?sdk=php-default',
                        description: 'The Users service allows you to manage your project users. Use this service to search, block, and view your users\' info, current sessions, and latest activity logs. You can also use the Users service to edit your users\' preferences and personal info.',
                        availableMethods: [
                            {
                                name: 'Create User',
                                description: 'Create a new user',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersCreate',
                                code: '$appWriteUsers->create(\'unique()\', $email, $password, $name);',
                            },
                            {
                                name: 'List Users',
                                description: 'Get a list of all the project\'s users. You can use the query params to filter your results.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersList',
                                code: '$users = $appWriteUsers->list($search, $limit, $offset, $cursor, $cursorDirection, $orderType);',
                            },
                            {
                                name: 'Get User',
                                description: 'Get a user by its unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersGet',
                                code: '$user = $appWriteUsers->get($userId);',
                            },
                            {
                                name: 'Get User Preferences',
                                description: 'Get the user preferences by its unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersGetPrefs',
                                code: '$userPreferences = $appWriteUsers->getPrefs($userId);',
                            },
                            {
                                name: 'Get User Sessions',
                                description: 'Get the user sessions list by its unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersGetSessions',
                                code: '$userSessions = $appWriteUsers->getSessions($userId);',
                            },
                            {
                                name: 'Get User Memberships',
                                description: 'Get the user membership list by its unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersGetMemberships',
                                code: '$userMemberships = $appWriteUsers->getMemberships($userId);',
                            },
                            {
                                name: 'Get User Logs',
                                description: 'Get the user activity logs list by its unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersGetLogs',
                                code: '$userLogs = $appWriteUsers->getLogs($userId, $limit, $offset);',
                            },
                            {
                                name: 'Update User Status',
                                description: 'Update the user status by its unique ID. Use this endpoint as an alternative to deleting a user if you want to keep user\'s ID reserved.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersUpdateStatus',
                                code: '$appWriteUsers->updateStatus($userId, $status);',
                            },
                            {
                                name: 'Update Email Verification',
                                description: 'Update the user email verification status by its unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersUpdateVerification',
                                code: '$appWriteUsers->updateVerification($userId, $status);',
                            },
                            {
                                name: 'Update Name',
                                description: 'Update the user name by its unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersUpdateName',
                                code: '$appWriteUsers->updateName($userId, $name);',
                            },
                            {
                                name: 'Update Password',
                                description: 'Update the user password by its unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersUpdatePassword',
                                code: '$appWriteUsers->updatePassword($userId, $password);',
                            },
                            {
                                name: 'Update Email',
                                description: 'Update the user email by its unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersUpdateEmail',
                                code: '$appWriteUsers->updateEmail($userId, $email);',
                            },
                            {
                                name: 'Update User Preferences',
                                description: 'Update the user preferences by its unique ID. The object you pass is stored as is, and replaces any previous value. The maximum allowed prefs size is 64kB and throws error if exceeded.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersUpdatePrefs',
                                code: '$appWriteUsers->updatePrefs($userId, $preferences);',
                            },
                            {
                                name: 'Delete User Session',
                                description: 'Delete a user sessions by its unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersDeleteSession',
                                code: '$appWriteUsers->deleteSession($userId, $sessionId);',
                            },
                            {
                                name: 'Delete User Sessions',
                                description: 'Delete all user\'s sessions by using the user\'s unique ID.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersDeleteSessions',
                                code: '$appWriteUsers->deleteSessions($userId);',
                            },
                            {
                                name: 'Delete User',
                                description: 'Delete a user by its unique ID, thereby releasing it\'s ID. Since ID is released and can be reused, all user-related resources like documents or storage files should be deleted before user deletion. If you want to keep ID reserved, use the updateStatus endpoint instead.',
                                link: 'https://appwrite.io/docs/server/users?sdk=php-default#usersDelete',
                                code: '$appWriteUsers->delete($userId);',
                            }
                        ],
                    },
                    {
                        selected: false,
                        totalResults: 0,
                        hasResults: true,
                        name: 'Teams API',
                        link: 'https://appwrite.io/docs/server/teams?sdk=php-default',
                        description: 'The Teams service allows you to group users of your project and to enable them to share read and write access to your project resources, such as database documents or storage files. Each user who creates a team becomes the team owner and can delegate the ownership role by inviting a new team member. Only team owners can invite new users to their team.',
                        availableMethods: [
                            {
                                name: 'Create Team',
                                description: 'Create a new team. The user who creates the team will automatically be assigned as the owner of the team. Only the users with the owner role can invite new members, add new owners and delete or update the team.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsCreate',
                                code: '$team = $appWriteTeams->create(\'unique()\', $name, $roles);',
                            },
                            {
                                name: 'List Teams',
                                description: 'Get a list of all the teams in which the current user is a member. You can use the parameters to filter your results. In admin mode, this endpoint returns a list of all the teams in the current project. Read docs to learn more about the different API modes.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsList',
                                code: '$teams = $appWriteTeams->list($search, $limit, $offset, $cursor, $cursorDirection, $orderType);',
                            },
                            {
                                name: 'Get Team',
                                description: 'Get a team by its ID. All team members have read access for this resource.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsGet',
                                code: '$team = $appWriteTeams->get($teamId);',
                            },
                            {
                                name: 'Update Team',
                                description: 'Update a team using its ID. Only members with the owner role can update the team.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsUpdate',
                                code: '$appWriteTeams->update($teamId, $name);',
                            },
                            {
                                name: 'Delete Team',
                                description: 'Delete a team using its ID. Only team members with the owner role can delete the team.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsDelete',
                                code: '$appWriteTeams->delete($teamId);',
                            },
                            {
                                name: 'Create Team Membership',
                                description: 'Invite a new member to join your team. If initiated from the client SDK, an email with a link to join the team will be sent to the member\'s email address and an account will be created for them should they not be signed up already. If initiated from server-side SDKs, the new member will automatically be added to the team. Use the url parameter to redirect the user from the invitation email back to your app. When the user is redirected, use the Update Team Membership Status endpoint to allow the user to accept the invitation to the team. Please note that to avoid a Redirect Attack the only valid redirect URL\'s are the once from domains you have set when adding your platforms in the console interface.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsCreateMembership',
                                code: '$appWriteTeams->createMembership($teamId, $email, $roles, $url, $name);',
                            },
                            {
                                name: 'Get Team Memberships',
                                description: 'Use this endpoint to list a team\'s members using the team\'s ID. All team members have read access to this endpoint.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsGetMemberships',
                                code: '$teamMemberships = $appWriteTeams->getMemberships($teamId, $search, $limit, $offset, $cursor, $cursorDirection, $orderType);',
                            },
                            {
                                name: 'Get Team Membership',
                                description: 'Get a team member by the membership unique id. All team members have read access for this resource.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsGetMemberships',
                                code: '$teamMembership = $appWriteTeams->getMembership($teamId, $membershipId);',
                            },
                            {
                                name: 'Update Membership Roles',
                                description: 'Modify the roles of a team member. Only team members with the owner role have access to this endpoint. Learn more about roles and permissions.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsUpdateMembershipRoles',
                                code: '$appWriteTeams->updateMembershipRoles($teamId, $membershipId, $roles);',
                            },
                            {
                                name: 'Update Team Membership Status',
                                description: 'Use this endpoint to allow a user to accept an invitation to join a team after being redirected back to your app from the invitation email received by the user. If the request is successful, a session for the user is automatically created.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsUpdateMembershipStatus',
                                code: '$appWriteTeams->updateMembershipStatus($teamId, $membershipId, $userId, $secret);',
                            },
                            {
                                name: 'Delete Team Membership',
                                description: 'This endpoint allows a user to leave a team or for a team owner to delete the membership of any other team member. You can also use this endpoint to delete a user membership even if it is not accepted.',
                                link: 'https://appwrite.io/docs/server/teams?sdk=php-default#teamsDeleteMembership',
                                code: '$appWriteTeams->deleteMembership($teamId, $membershipId);',
                            },
                        ],
                    },
                    {
                        selected: false,
                        totalResults: 0,
                        hasResults: true,
                        name: 'Database API',
                        link: 'https://appwrite.io/docs/server/database?sdk=php-default',
                        description: 'The Database service allows you to create structured collections of documents, query and filter lists of documents, and manage an advanced set of read and write access permissions. All the data in the database service is stored in structured JSON documents. Each database document structure in your project is defined using the Appwrite collection attributes. The collection attributes help you ensure all your user-submitted data is validated and stored according to the collection structure. Using Appwrite permissions architecture, you can assign read or write access to each collection or document in your project for either a specific user, team, user role, or even grant it with public access (role:all). You can learn more about how Appwrite handles permissions and access control.',
                        availableMethods: [
                            {
                                name: 'Create Collection',
                                description: 'Create a new Collection.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseCreateCollection',
                                code: '$collection = $appWriteDatabase->createCollection(\'unique()\', $name, $permissionModel, $readPermissions, $writePermissions);',
                            },
                            {
                                name: 'List Collections',
                                description: 'Get a list of all the user collections. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project\'s collections. Learn more about different API modes.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseListCollections',
                                code: '$collections = $appWriteDatabase->listCollections($search, $limit, $offset, $cursor, $cursorDirection, $orderType);',
                            },
                            {
                                name: 'Get Collection',
                                description: 'Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseGetCollection',
                                code: '$collection = $appWriteDatabase->getCollection($collectionId);',
                            },
                            {
                                name: 'Update Collection',
                                description: 'Update a collection by its unique ID.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseUpdateCollection',
                                code: '$appWriteDatabase->updateCollection($collectionId, $name, $permissionModel, $readPermissions, $writePermissions, $enabledStatus);',
                            },
                            {
                                name: 'Delete Collection',
                                description: 'Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseDeleteCollection',
                                code: '$appWriteDatabase->deleteCollection($collectionId);',
                            },
                            {
                                name: 'Create String Attribute',
                                description: 'Create a string attribute.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseCreateStringAttribute',
                                code: '$attribute = $appWriteDatabase->createStringAttribute($collectionId, $key, $size, $required, $default, $isArray);',
                            },
                            {
                                name: 'Create Email Attribute',
                                description: 'Create an email attribute.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseCreateEmailAttribute',
                                code: '$attribute = $appWriteDatabase->createEmailAttribute($collectionId, $key, $required, $default, $isArray);',
                            },
                            {
                                name: 'Create Enum Attribute',
                                description: 'Create an enum attribute.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseCreateEnumAttribute',
                                code: '$attribute = $appWriteDatabase->createEnumAttribute($collectionId, $key, $elements, $required, $default, $isArray);',
                            },
                            {
                                name: 'Create IP Address Attribute',
                                description: 'Create IP address attribute.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseCreateIpAttribute',
                                code: '$attribute = $appWriteDatabase->createIpAttribute($collectionId, $key, $required, $default, $isArray);',
                            },
                            {
                                name: 'Create URL Attribute',
                                description: 'Create a URL attribute.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseCreateUrlAttribute',
                                code: '$attribute = $appWriteDatabase->createUrlAttribute($collectionId, $key, $required, $default, $isArray);',
                            },
                            {
                                name: 'Create Integer Attribute',
                                description: 'Create an integer attribute. Optionally, minimum and maximum values can be provided.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseCreateIntegerAttribute',
                                code: '$attribute = $appWriteDatabase->createIntegerAttribute($collectionId, $key, $required, $min, $max, $default, $isArray);',
                            },
                            {
                                name: 'Create Float Attribute',
                                description: 'Create a float attribute. Optionally, minimum and maximum values can be provided.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseCreateFloatAttribute',
                                code: '$attribute = $appWriteDatabase->createFloatAttribute($collectionId, $key, $required, $min, $max, $default, $isArray);',
                            },
                            {
                                name: 'Create Boolean Attribute',
                                description: 'Create a boolean attribute.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseCreateBooleanAttribute',
                                code: '$attribute = $appWriteDatabase->createBooleanAttribute($collectionId, $key, $required, $default, $isArray);',
                            },
                            {
                                name: 'List Attributes',
                                description: 'Get a list of all the attributes',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseListAttributes',
                                code: '$attributes = $appWriteDatabase->listAttributes($collectionId);',
                            },
                            {
                                name: 'Get Attribute',
                                description: 'Get a specific attribute',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseGetAttribute',
                                code: '$attribute = $appWriteDatabase->getAttribute($collectionId, $attributeKey);',
                            },
                            {
                                name: 'Delete Attribute',
                                description: 'Delete an attribute by its attribute key.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseDeleteAttribute',
                                code: '$appWriteDatabase->deleteAttribute($collectionId, $attributeKey);',
                            },
                            {
                                name: 'Create Index',
                                description: 'Create an index.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseCreateIndex',
                                code: '$index = $appWriteDatabase->createIndex($collectionId, $indexKey, $indexType, $attributes, $orders);',
                            },
                            {
                                name: 'List Indexes',
                                description: 'Get a list of all the indexes',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseListIndexes',
                                code: '$indexes = $appWriteDatabase->listIndexes($collectionId);',
                            },
                            {
                                name: 'Get Index',
                                description: 'Get a specific index',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseGetIndex',
                                code: '$index = $appWriteDatabase->getIndex($collectionId, $indexKey);',
                            },
                            {
                                name: 'Delete Index',
                                description: 'Delete an index by its index key.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseDeleteIndex',
                                code: '$appWriteDatabase->deleteIndex($collectionId, $indexKey);',
                            },
                            {
                                name: 'Create Document',
                                description: 'Create a new Document. Before using this route, you should create a new collection resource using either a server integration API or directly from your database console.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseDeleteIndex',
                                code: '$document = $appWriteDatabase->createDocument($collectionId, \'unique()\', $data, $readPermissions, $writePermissions);',
                            },
                            {
                                name: 'List Documents',
                                description: 'Get a list of all the user documents. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project\'s documents. Learn more about different API modes.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseListDocuments',
                                code: '$documents = $appWriteDatabase->listDocuments($collectionId, $queries, $limit, $offset, $cursor, $cursorDirection, $orderAttributes, $orderTypes);',
                            },
                            {
                                name: 'Get Document',
                                description: 'Get a document by its unique ID. This endpoint response returns a JSON object with the document data.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseGetDocument',
                                code: '$document = $appWriteDatabase->getDocument($collectionId, $documentId);',
                            },
                            {
                                name: 'Update Document',
                                description: 'Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseUpdateDocument',
                                code: '$appWriteDatabase->updateDocument($collectionId, $documentId, $data, $readPermissions, $writePermissions);',
                            },
                            {
                                name: 'Delete Document',
                                description: 'Delete a document by its unique ID.',
                                link: 'https://appwrite.io/docs/server/database?sdk=php-default#databaseUpdateDocument',
                                code: '$appWriteDatabase->deleteDocument($collectionId, $documentId);',
                            },
                        ]
                    },
                    {
                        selected: false,
                        totalResults: 0,
                        hasResults: true,
                        name: 'Storage API',
                        link: 'https://appwrite.io/docs/server/storage?sdk=php-default',
                        description: 'The Storage service allows you to manage your project files. Using the Storage service, you can upload, view, download, and query all your project files. Files are managed using buckets. Storage buckets are similar to Collections we have in our Database service. The difference is, buckets also provide more power to decide what kinds of files, what sizes you want to allow in that bucket, whether or not to encrypt the files, scan with antivirus and more. Using Appwrite permissions architecture, you can assign read or write access to each bucket or file in your project for either a specific user, team, user role, or even grant it with public access (role:all). You can learn more about how Appwrite handles permissions and access control. The preview endpoint allows you to generate preview images for your files. Using the preview endpoint, you can also manipulate the resulting image so that it will fit perfectly inside your app in terms of dimensions, file size, and style. The preview endpoint also allows you to change the resulting image file format for better compression or image quality for better delivery over the network.',
                        availableMethods: [
                            {
                                name: 'Create bucket',
                                description: 'Create a new storage bucket.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageCreateBucket',
                                code: '$bucket = $appWriteStorage->createBucket(\'unique()\', $name, $permissionModel, $readPermissions, $writePermissions, $enabledStatus, $maximumFileSize, $allowedFileExtensions, $encryption, $antivirus);',
                            },
                            {
                                name: 'List buckets',
                                description: 'Get a list of all the storage buckets. You can use the query params to filter your results.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageListBuckets',
                                code: '$buckets = $appWriteStorage->listBuckets($search, $limit, $offset, $cursor, $cursorDirection, $orderType);'
                            },
                            {
                                name: 'Get Bucket',
                                description: 'Get a storage bucket by its unique ID. This endpoint response returns a JSON object with the storage bucket metadata.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageGetBucket',
                                code: '$bucket = $appWriteStorage->getBucket($bucketId);'
                            },
                            {
                                name: 'Update Bucket',
                                description: 'Update a storage bucket by its unique ID.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageUpdateBucket',
                                code: '$appWriteStorage->getBucket($bucketId, $name, $permissionModel, $readPermissions, $writePermissions, $enabledStatus, $maximumFileSize, $allowedFileExtensions, $encryption, $antivirus);',
                            },
                            {
                                name: 'Delete Bucket',
                                description: 'Delete a storage bucket by its unique ID.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageDeleteBucket',
                                code: '$appWriteStorage->deleteBucket($bucketId);'
                            },
                            {
                                name: 'Create File',
                                description: 'Create a new file. Before using this route, you should create a new bucket resource using either a server integration API or directly from your Appwrite console. Larger files should be uploaded using multiple requests with the content-range header to send a partial request with a maximum supported chunk of 5MB. The content-range header values should always be in bytes. When the first request is sent, the server will return the File object, and the subsequent part request must include the file\'s id in x-appwrite-id header to allow the server to know that the partial upload is for the existing file and not for a new one. If you\'re creating a new file using one of the Appwrite SDKs, all the chunking logic will be managed by the SDK internally.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageCreateFile',
                                code: '$file = $appWriteStorage->createFile($bucketId, \'unique()\', $file, $readPermissions, $writePermissions);'
                            },
                            {
                                name: 'List Files',
                                description: 'Get a list of all the user files. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project\'s files. Learn more about different API modes.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageListFiles',
                                code: '$files = $appWriteStorage->listFiles($bucketId, $search, $limit, $offset, $cursor, $cursorDirection, $orderType);'
                            },
                            {
                                name: 'Get File',
                                description: 'Get a file by its unique ID. This endpoint response returns a JSON object with the file metadata.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageGetFile',
                                code: '$file = $appWriteStorage->getFile($bucketId, $fileId);'
                            },
                            {
                                name: 'Get File Preview',
                                description: 'Get a file preview image. Currently, this method supports preview for image files (jpg, png, and gif), other supported formats, like pdf, docs, slides, and spreadsheets, will return the file icon image. You can also pass query string arguments for cutting and resizing your preview image. Preview is supported only for image files smaller than 10MB.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageGetFilePreview',
                                code: '$filePreview = $appWriteStorage->getFilePreview($bucketId, $fileId, $width, $height, $gravity, $quality, $borderWidth, $borderColor, $borderRadius, $opacity, $rotation, $background, $output);'
                            },
                            {
                                name: 'Get File for Download',
                                description: 'Get a file content by its unique ID. The endpoint response return with a \'Content-Disposition: attachment\' header that tells the browser to start downloading the file to user downloads directory.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageGetFileDownload',
                                code: '$appWriteStorage->getFileDownload($bucketId, $fileId);'
                            },
                            {
                                name: 'Get File for View',
                                description: 'Get a file content by its unique ID. This endpoint is similar to the download method but returns with no \'Content-Disposition: attachment\' header.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageGetFileView',
                                code: '$appWriteStorage->getFileView($bucketId, $fileId);'
                            },
                            {
                                name: 'Update File',
                                description: 'Update a file by its unique ID. Only users with write permissions have access to update this resource.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageUpdateFile',
                                code: '$appWriteStorage->updateFile($bucketId, $fileId, $readPermissions, $writePermissions);'
                            },
                            {
                                name: 'Delete File',
                                description: 'Delete a file by its unique ID. Only users with write permissions have access to delete this resource.',
                                link: 'https://appwrite.io/docs/server/storage?sdk=php-default#storageDeleteFile',
                                code: '$appWriteStorage->deleteFile($bucketId, $fileId);'
                            },
                        ]
                    },
                    {
                        selected: false,
                        totalResults: 0,
                        hasResults: true,
                        name: 'Functions API',
                        link: 'https://appwrite.io/docs/server/functions?sdk=php-default',
                        description: 'The Functions service allows you to create custom behaviour that can be triggered by any supported Appwrite system events or by a predefined schedule. Appwrite Cloud Functions lets you automatically run backend code in response to events triggered by Appwrite or by setting it to be executed in a predefined schedule. Your code is stored in a secure way on your Appwrite instance and is executed in an isolated environment. You can learn more by following our Cloud Functions tutorial.',
                        availableMethods: [
                            {
                                name: 'Create Function',
                                description: 'Create a new function. You can pass a list of permissions to allow different project users or team with access to execute the function using the client API.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsCreate',
                                code: '$function = $appWriteFunctions->create(\'unique()\', $name, $execute, $runtime, $vars, $events, $schedule, $timeout);'
                            },
                            {
                                name: 'List Functions',
                                description: 'Get a list of all the project\'s functions. You can use the query params to filter your results.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsCreate',
                                code: '$functions = $appWriteFunctions->list($search, $limit, $offset, $cursor, $cursorDirection, $orderType);',
                            },
                            {
                                name: 'List runtimes',
                                description: 'Get a list of all runtimes that are currently active on your instance.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsListRuntimes',
                                code: '$runtimes = $appWriteFunctions->listRuntimes();'
                            },
                            {
                                name: 'Get Function',
                                description: 'Get a function by its unique ID.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsGet',
                                code: '$function = $appWriteFunctions->get($functionId);'
                            },
                            {
                                name: 'Update Function',
                                description: 'Update function by its unique ID.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsUpdate',
                                code: '$appWriteFunctions->update($functionId, $name, $execute, $runtime, $vars, $events, $schedule, $timeout);'
                            },
                            {
                                name: 'Update Function Deployment',
                                description: 'Update the function code deployment ID using the unique function ID. Use this endpoint to switch the code deployment that should be executed by the execution endpoint.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsUpdateDeployment',
                                code: '$appWriteFunctions->updateDeployment($functionId, $deploymentId);'
                            },
                            {
                                name: 'Delete Function',
                                description: 'Delete a function by its unique ID.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsDelete',
                                code: '$appWriteFunctions->updateDeployment($functionId);'
                            },
                            {
                                name: 'Create Deployment',
                                description: 'Create a new function code deployment. Use this endpoint to upload a new version of your code function. To execute your newly uploaded code, you\'ll need to update the function\'s deployment to use your new deployment UID. This endpoint accepts a tar.gz file compressed with your code. Make sure to include any dependencies your code has within the compressed file. You can learn more about code packaging in the Appwrite Cloud Functions tutorial. Use the "command" param to set the entry point used to execute your code.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsCreateDeployment',
                                code: '$deployment = $appWriteFunctions->createDeployment($functionId, $entryPoint, $file, $activateStatus);'
                            },
                            {
                                name: 'List Deployments',
                                description: 'Get a list of all the project\'s code deployments. You can use the query params to filter your results.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsListDeployments',
                                code: '$deployments = $appWriteFunctions->listDeployments($functionId, $search, $limit, $offset, $cursor, $cursorDirection, $orderType);'
                            },
                            {
                                name: 'Get Deployment',
                                description: 'Get a code deployment by its unique ID.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsGetDeployment',
                                code: '$deployment = $appWriteFunctions->getDeployment($functionId, $deploymentId);'
                            },
                            {
                                name: 'Delete Deployment',
                                description: 'Delete a code deployment by its unique ID.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsDeleteDeployment',
                                code: '$appWriteFunctions->deleteDeployment($functionId, $deploymentId);'
                            },
                            {
                                name: 'Create Execution',
                                description: 'Trigger a function execution. The returned object will return you the current execution status. You can ping the Get Execution endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsCreateExecution',
                                code: '$execution = $appWriteFunctions->createExecution($functionId, $data, $asyncStatus);'
                            },
                            {
                                name: 'List Executions',
                                description: 'Get a list of all the current user function execution logs. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project\'s executions. Learn more about different API modes.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsListExecutions',
                                code: '$executions = $appWriteFunctions->listExecutions($functionId, $search, $limit, $offset, $cursor, $cursorDirection, $orderType);'
                            },
                            {
                                name: 'Get Execution',
                                description: 'Get a function execution log by its unique ID.',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsGetExecution',
                                code: '$execution = $appWriteFunctions->listExecutions($functionId, $executionId);'
                            },
                            {
                                name: 'Retry Build',
                                description: '',
                                link: 'https://appwrite.io/docs/server/functions?sdk=php-default#functionsRetryBuild',
                                code: '$appWriteFunctions->retryBuild($functionId, $executionId, $buildId);'
                            },
                        ]
                    }
                ],
                searchIndexes: [],
                totalResults: 0,
                searchTerm: ''
            }
        },
        watch: {
            searchTerm(newSearchTerm, oldSearchTerm) {

                //  Start a search using the given search term
                this.startSearch(newSearchTerm);

            },
        },
        methods: {
            startSearch(searchTerm) {

                this.totalResults = 0;

                //  Reset the search indexes
                this.searchIndexes = [];

                this.apis.forEach((api, index) => {

                    this.searchIndexes[index] = [];

                    this.apis[index].availableMethods.map((method, index2) => {

                        //  Convert the serach term to lowercase
                        searchTerm = searchTerm.toLowerCase();

                        //  Check if we have the search term
                        const hasSearchTerm = searchTerm !== '';

                        //  Check if the method name matches the search term
                        const nameMatchesSearchTerm = method.name.toLowerCase().includes(searchTerm);

                        //  Check if the method code matches the search term
                        const codeMatchesSearchTerm = method.code.toLowerCase().includes(searchTerm);

                        //  Check if the method description matches the search term
                        const descriptionMatchesSearchTerm = method.description.toLowerCase().includes(searchTerm);

                        //  Determine if we have a match from the possible matches above
                        const matchesSearchTerm = (nameMatchesSearchTerm || codeMatchesSearchTerm || descriptionMatchesSearchTerm);

                        //  If we do not have the search term or the search term has a matching result
                        if( hasSearchTerm == false || (hasSearchTerm == true && matchesSearchTerm == true) ) {

                            //  Indicate that this method must be shown within the search results
                            this.searchIndexes[index].push(index2);

                        }

                    });

                    this.apis[index]['totalResults'] = this.searchIndexes[index].length;

                    this.apis['hasResults'] = this.apis[index]['totalResults'] > 0;

                    this.totalResults += this.apis[index]['totalResults'];

                });

                this.$emit('updateCount', this.totalResults);

            },
            copyToClipboard(index, index2) {
                this.$refs['clipboard-'+index+'-'+index2][0].copyToClipboard();
            },
            handleSelectedMethod(index) {

                this.apis[index].selected = !this.apis[index].selected;

                this.apis.forEach((api, currIndex) => {
                    if(currIndex !== index) {
                        api.selected = false;
                    }
                });

            }
        },
        created() {
            this.startSearch(this.searchTerm);
        }
    }
</script>
