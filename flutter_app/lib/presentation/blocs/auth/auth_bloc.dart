import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../core/utils/app_logger.dart';
import '../../../data/models/user_model.dart';
import '../../../data/repositories/auth_repository.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;

  AuthBloc(this._authRepository) : super(const AuthInitial()) {
    on<AuthCheckStatus>(_onCheckStatus);
    on<AuthLoginRequested>(_onLogin);
    on<AuthRegisterRequested>(_onRegister);
    on<AuthGoogleLoginRequested>(_onGoogleLogin);
    on<AuthLogoutRequested>(_onLogout);
  }

  Future<void> _onCheckStatus(AuthCheckStatus event, Emitter<AuthState> emit) async {
    AppLogger.bloc('AuthCheckStatus — isLoggedIn=${_authRepository.isLoggedIn}');
    emit(const AuthLoading());
    if (_authRepository.isLoggedIn) {
      try {
        final user = await _authRepository.refreshUser();
        AppLogger.bloc('AuthCheckStatus ✓ → AuthAuthenticated(${user.email})');
        emit(AuthAuthenticated(user: user));
      } catch (e) {
        AppLogger.error('AuthCheckStatus refresh failed', e);
        emit(const AuthUnauthenticated());
      }
    } else {
      AppLogger.bloc('AuthCheckStatus → AuthUnauthenticated');
      emit(const AuthUnauthenticated());
    }
  }

  Future<void> _onLogin(AuthLoginRequested event, Emitter<AuthState> emit) async {
    AppLogger.bloc('AuthLoginRequested → ${event.email}');
    emit(const AuthLoading());
    try {
      final user = await _authRepository.login(event.email, event.password);
      AppLogger.bloc('AuthLoginRequested ✓ → AuthAuthenticated(${user.email})');
      emit(AuthAuthenticated(user: user));
    } catch (e) {
      final msg = _parseError(e);
      AppLogger.error('AuthLoginRequested failed — $msg', e);
      emit(AuthError(message: msg));
    }
  }

  Future<void> _onRegister(AuthRegisterRequested event, Emitter<AuthState> emit) async {
    AppLogger.bloc('AuthRegisterRequested → ${event.email}');
    emit(const AuthLoading());
    try {
      final user = await _authRepository.register(event.name, event.email, event.password);
      AppLogger.bloc('AuthRegisterRequested ✓ → AuthAuthenticated(${user.email})');
      emit(AuthAuthenticated(user: user));
    } catch (e) {
      final msg = _parseError(e);
      AppLogger.error('AuthRegisterRequested failed — $msg', e);
      emit(AuthError(message: msg));
    }
  }

  Future<void> _onGoogleLogin(AuthGoogleLoginRequested event, Emitter<AuthState> emit) async {
    AppLogger.bloc('AuthGoogleLoginRequested');
    emit(const AuthLoading());
    try {
      final user = await _authRepository.loginWithGoogle();
      AppLogger.bloc('AuthGoogleLoginRequested ✓ → AuthAuthenticated(${user.email})');
      emit(AuthAuthenticated(user: user));
    } catch (e) {
      final msg = _parseError(e);
      AppLogger.error('AuthGoogleLoginRequested failed — $msg', e);
      emit(AuthError(message: msg));
    }
  }

  Future<void> _onLogout(AuthLogoutRequested event, Emitter<AuthState> emit) async {
    AppLogger.bloc('AuthLogoutRequested');
    await _authRepository.logout();
    AppLogger.bloc('AuthLogoutRequested ✓ → AuthUnauthenticated');
    emit(const AuthUnauthenticated());
  }

  String _parseError(Object e) {
    final msg = e.toString();
    if (msg.contains('user-not-found') || msg.contains('wrong-password') || msg.contains('invalid-credential')) {
      return 'Invalid email or password.';
    }
    if (msg.contains('email-already-in-use')) {
      return 'An account already exists with this email.';
    }
    if (msg.contains('weak-password')) {
      return 'Password must be at least 6 characters.';
    }
    if (msg.contains('network') || msg.contains('No internet')) {
      return 'No internet connection. Please try again.';
    }
    return msg.replaceAll('Exception: ', '');
  }
}
