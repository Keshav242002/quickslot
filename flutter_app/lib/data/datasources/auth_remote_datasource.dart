import '../../core/network/api_client.dart';
import '../../core/constants/api_constants.dart';
import '../../core/utils/app_logger.dart';
import '../models/user_model.dart';

class AuthRemoteDataSource {
  final ApiClient _client;

  AuthRemoteDataSource(this._client);

  Future<UserModel> syncUser() async {
    AppLogger.api('syncUser → POST ${ApiConstants.authSync}');
    final response = await _client.post(ApiConstants.authSync);
    AppLogger.api('syncUser ✓');
    return UserModel.fromJson(response.data);
  }
}
