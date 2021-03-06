﻿namespace blacktip {
    'use strict';

	/**
	 * Controller for the contact us page
	 */
    export class ContactCtrl {
        // An array of todo items
        private http: ng.IHttpService;
        private mail: Modepress.IMessage;
        private static signaller: Function | null;

        // The dependency injector
        public static $inject = [ '$http', 'signaller', 'meta' ];

		/**
		 * Creates an instance of the home controller
		 */
        constructor( http: ng.IHttpService, signaller: Function, meta: Meta ) {
            this.http = http;
            this.mail = { email: '', name: '', message: '' };
            ContactCtrl.signaller = signaller;

            meta.defaults();

            // Create a few specific meta tags
            meta.title = 'Contact Webinate';
            meta.description = 'Experienced web developers for web and mobile app development based in Dublin. Contact us through at sales@webinate.net for more information';
            meta.brief = meta.description;

            // Check if maps was already loaded
            if ( ( <any>window ).google && google.maps )
                ContactCtrl.initMap();
            else
                this.lazyLoadGoogleMap();
        }

        /**
         * Dynamically loads google maps instead of it being added in the header
         */
        lazyLoadGoogleMap() {
            $.getScript( 'https://maps.google.com/maps/api/js?sensor=true&callback=blacktip.ContactCtrl.initMap' );
        }

        /**
         * Initializes the map once its ready
         */
        static initMap() {
            // Create the map object and center it on the premise
            const geocoder = new google.maps.Geocoder();
            const map = new google.maps.Map( jQuery( '.map' ).get( 0 ), {
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            geocoder.geocode( {
                'address': 'Suite 203, I.a.d.t. Media Cube, Kill Ave, Dublin'
            }, function( results, status ) {
                if ( status === google.maps.GeocoderStatus.OK ) {
                    map.setCenter( results[ 0 ].geometry.location );
                    new google.maps.Marker( { map: map, position: results[ 0 ].geometry.location });
                }
            });

            ContactCtrl.signaller!();
            ContactCtrl.signaller = null;
        }

		/*
		 * Sends an email to the modepress admin
		 */
        sendMessage() {
            const details = this.mail;
            jQuery( '.success' ).hide();
            jQuery( '.error' ).hide();
            jQuery( '#contact-form .submit' ).prop( 'disabled', true );

            this.http.post( '/api/message-admin', details ).then(( response: ng.IHttpPromiseCallbackArg<any> ) => {
                // Check for any errors
                if ( response.data.error ) {
                    jQuery( '.error' ).show().text( response.data.message );
                    return;
                }
                else {
                    jQuery( '.success' ).show().text( response.data.message );
                }
            }).catch( function() {
                jQuery( '.error' ).show().text( `Oh dear, there seems to be an error with our server.
                    Please try again or send us an email and we'll try get back to you as soon as possible`);

            }).finally( function() {
                jQuery( '#contact-form .submit' ).prop( 'disabled', false );
            });
        }
    }
}