var app = angular.module('bookApp', ['ngRoute']);

app.controller('BookController', function ($scope, $http) {
  $scope.loggedIn = false;
  $scope.showPopup = false;
  $scope.showFavorites = false;
  $scope.books = [];
  $scope.favorites = [];
  $scope.searchQuery = '';
  $scope.currentPage = 1;
  $scope.totalPage = 0;
  $scope.booksPerPage = 5;

  $scope.fakeLogin = function () {
    $scope.loggedIn = true;
    $scope.searchBooks();
  };

  $scope.searchBooks = function () {
    var apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=search+intitle:' + encodeURIComponent($scope.searchQuery);

    $http.get(apiUrl)
      .then(function(response) {
        $scope.books = response.data.items || [];
        $scope.totalPage = Math.ceil($scope.books.length / $scope.booksPerPage);
        $scope.updatePagedBooks();
      })
      .catch(function(error) {
        console.error('Error fetching books from Google Books API', error);
      });
  };

      $scope.pagedBooks = [];

      $scope.updatePagedBooks = function () {
        var startIndex = ($scope.currentPage - 1) * $scope.booksPerPage;
        var endIndex = startIndex + $scope.booksPerPage;
        $scope.pagedBooks = $scope.books.slice(startIndex, endIndex);
      };

      $scope.fetchBooks = function (direction) {
        if (direction === 'previous' && $scope.currentPage > 1) {
          $scope.currentPage--;
        } else if (direction === 'next' && $scope.currentPage < $scope.totalPage) {
          $scope.currentPage++;
        }
        $scope.updatePagedBooks();
      };

      $scope.showDetails = function (book) {
       if(book.volumeInfo && book.volumeInfo.description) {
          book.showDescription = true;
        }
      };

      $scope.hideDetails = function (book) {
        book.showDescription = false;
      };

      $scope.toggleFavorite = function (book) {
        var index = $scope.favorites.findIndex(fav => fav.id === book.id);

        if (index === -1) {
          // Le livre n'est pas dans les favoris, l'ajouter
          $scope.favorites.push(book);
        } else {
          // Le livre est déjà dans les favoris, le retirer
          $scope.favorites.splice(index, 1);
        }
      };

      $scope.isFavorite = function (book) {
        return $scope.favorites.some(fav => fav.id === book.id);
      };
      $scope.goToFavorites = function () {
        $scope.loggedIn = false;
        $scope.showFavorites = true;
      };
      $scope.returnToIndex = function () {
        $scope.loggedIn = true;
        $scope.showFavorites = false;
      };
      
});

