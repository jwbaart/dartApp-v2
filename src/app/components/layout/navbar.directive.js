(function() {
    'use strict';

    angular
        .module('dartApp.layout')
        .directive('drtNavbar', drtNavbar);

    /* @ngInject */
    function drtNavbar() {
        var drtNavbar = {
            restrict: 'EA',
            templateUrl: 'app/components/layout/navbar.html',
            scope: {
            },
            link: linkFunc,
            controller: drtNavbarController,
            controllerAs: 'vm',
            bindToController: true
        };

        return drtNavbar;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    drtNavbarController.$inject = ['AuthService', '$location', 'GamesService', '$rootScope', 'InvitationsService', 'PlayersService', 'HelperService'];

    /* @ngInject */
    function drtNavbarController(AuthService, $location, GamesService, $rootScope,InvitationsService, PlayersService, HelperService) {
        var vm = this;

        vm.login = login;
        vm.logout = logout;
        vm.isLoggedIn = AuthService.getAuth;
        vm.activeGame = activeGame;

        function login(provider) {
          AuthService.login(provider).then(function(authData) {
            PlayersService.addPlayer(authData);
            InvitationsService.watchInvitations();
            HelperService.redirect('/');
          }, function(error) {
            // TODO: Inform user
          });
        }

        function activeGame() {
          var authData = AuthService.getAuth();
          var result = '';

          if (authData) {
            result = '/' + GamesService.activeGame(authData.uid);
          }

          return result;
        }

        function logout() {
            PlayersService.removePlayer(AuthService.getAuth()).then(function() {
              PlayersService.reset();
              GamesService.reset();
              InvitationsService.reset();
              AuthService.logout();
              HelperService.redirect('/');
            });

            // $rootScope.$apply(function() {
            //   $location.path("/");
            // });

        }
    }
})();
