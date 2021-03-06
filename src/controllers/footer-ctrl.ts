﻿namespace blacktip {
    export class FooterCtrl {
        public posts: Array<Modepress.IPost>;

        // The dependency injector
        public static $inject = [ '$scope', '$http', 'apiURL' ];

        constructor( scope: any, http: ng.IHttpService, apiURL: string ) {
            scope.posts = [];
            http.get<Modepress.IGetPosts>( `${apiURL}/posts?limit=5&minimal=true&tags=webinate&visibility=public` ).then( function( posts ) {
                scope.posts = posts.data!.data;
            });
        }
    }
}