angular.module('mine.slice', []).filter('slice', function () {
  return function (inputArr, start, end) {
    var resultArr = []

    if (!angular.isArray(inputArr)) {
      return inputArr
    }
    if (start < 0) {
      start = 0
    }
    if (end > inputArr.length) {
      end = inputArr.length
    }

    for (var i = start; i < end; ++i) {
      resultArr.push(inputArr[i])
    }
    return resultArr
  }
})
