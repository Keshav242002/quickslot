import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../../core/utils/app_logger.dart';
import '../datasources/auth_remote_datasource.dart';
import '../models/user_model.dart';

class AuthRepository {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email'],
    serverClientId: '566889660924-t0c0mq7prjk5tqbpus81mfiunok82iua.apps.googleusercontent.com',
  );
  final AuthRemoteDataSource _remoteDataSource;

  AuthRepository(this._remoteDataSource);

  Future<UserModel> login(String email, String password) async {
    AppLogger.firebase('signInWithEmailAndPassword → $email');
    await _firebaseAuth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );
    AppLogger.firebase('signInWithEmailAndPassword ✓ — syncing user');
    return await _remoteDataSource.syncUser();
  }

  Future<UserModel> register(String name, String email, String password) async {
    AppLogger.firebase('createUserWithEmailAndPassword → $email');
    final credential = await _firebaseAuth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );
    AppLogger.firebase('createUserWithEmailAndPassword ✓ — updating display name');
    await credential.user!.updateDisplayName(name);
    await credential.user!.reload();
    AppLogger.firebase('displayName updated — syncing user');
    return await _remoteDataSource.syncUser();
  }

  Future<UserModel> loginWithGoogle() async {
    try {
      AppLogger.firebase('GoogleSignIn.signIn()');
      final googleUser = await _googleSignIn.signIn();
      if (googleUser == null) throw Exception('Google sign-in cancelled.');
      AppLogger.firebase('GoogleSignIn ✓ — fetching auth tokens for ${googleUser.email}');
      final googleAuth = await googleUser.authentication;
      if (googleAuth.idToken == null && googleAuth.accessToken == null) {
        throw Exception(
          'Google Sign-In failed: OAuth client not configured. '
          'Add your SHA-1 fingerprint to Firebase Console.',
        );
      }
      AppLogger.firebase('Google tokens received — signing in with Firebase credential');
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      await _firebaseAuth.signInWithCredential(credential);
      AppLogger.firebase('Firebase Google sign-in ✓ — syncing user');
      return await _remoteDataSource.syncUser();
    } on Exception {
      rethrow;
    } catch (e) {
      throw Exception('Google Sign-In failed: $e');
    }
  }

  Future<void> logout() async {
    AppLogger.firebase('signOut');
    await _googleSignIn.signOut();
    await _firebaseAuth.signOut();
    AppLogger.firebase('signOut ✓');
  }

  Future<UserModel> refreshUser() {
    AppLogger.firebase('refreshUser — syncing user');
    return _remoteDataSource.syncUser();
  }

  bool get isLoggedIn => _firebaseAuth.currentUser != null;

  Stream<User?> get authStateChanges => _firebaseAuth.authStateChanges();
}
