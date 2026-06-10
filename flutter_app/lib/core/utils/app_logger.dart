import 'dart:developer' as dev;
import 'package:flutter/foundation.dart';

class AppLogger {
  static void firebase(String message) {
    if (kDebugMode) dev.log(message, name: 'Firebase');
  }

  static void api(String message) {
    if (kDebugMode) dev.log(message, name: 'API');
  }

  static void bloc(String message) {
    if (kDebugMode) dev.log(message, name: 'BLoC');
  }

  static void error(String message, [Object? err]) {
    if (kDebugMode) {
      dev.log(message, name: 'Error', error: err);
    }
  }
}
