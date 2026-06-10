import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import '../../core/theme/app_theme.dart';
import '../../data/models/venue_model.dart';
import '../blocs/auth/auth_bloc.dart';
import '../blocs/venue/venue_bloc.dart';
import '../widgets/venue_card.dart';
import '../widgets/loading_widget.dart';
import '../widgets/error_widget.dart';
import '../widgets/empty_state_widget.dart';
import 'venue_detail_screen.dart';

class VenueListScreen extends StatefulWidget {
  final VoidCallback? onBookingSuccess;
  const VenueListScreen({super.key, this.onBookingSuccess});

  @override
  State<VenueListScreen> createState() => _VenueListScreenState();
}

class _VenueListScreenState extends State<VenueListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<VenueBloc>().add(const VenueFetchRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Text('⚡', style: TextStyle(fontSize: 20)),
            const SizedBox(width: 8),
            const Text('QuickSlot'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: () => _confirmLogout(context),
          ),
        ],
      ),
      body: BlocBuilder<VenueBloc, VenueState>(
        builder: (context, state) {
          if (state is VenueLoading || state is VenueInitial) {
            return const AppLoadingWidget(type: LoadingType.venueList);
          }
          if (state is VenueError) {
            return AppErrorWidget(
              message: state.message,
              onRetry: () => context.read<VenueBloc>().add(const VenueFetchRequested()),
            );
          }
          if (state is VenueEmpty) {
            return const AppEmptyWidget(
              title: 'No venues available',
              subtitle: 'Check back later for new venues.',
              icon: Icons.sports_rounded,
            );
          }
          if (state is VenueLoaded) {
            return _buildList(state.venues);
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildList(List<VenueModel> venues) {
    return RefreshIndicator(
      color: AppTheme.accentGreen,
      backgroundColor: AppTheme.surfaceColor,
      onRefresh: () async {
        context.read<VenueBloc>().add(const VenueFetchRequested());
        await context.read<VenueBloc>().stream.firstWhere(
              (s) => s is VenueLoaded || s is VenueError || s is VenueEmpty,
            );
      },
      child: AnimationLimiter(
        child: ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: venues.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            return AnimationConfiguration.staggeredList(
              position: index,
              duration: const Duration(milliseconds: 375),
              child: SlideAnimation(
                verticalOffset: 50,
                child: FadeInAnimation(
                  child: VenueCard(
                    venue: venues[index],
                    onTap: () => Navigator.push<bool>(
                      context,
                      MaterialPageRoute(
                        builder: (_) => VenueDetailScreen(venue: venues[index]),
                      ),
                    ).then((booked) {
                      if (booked == true) widget.onBookingSuccess?.call();
                    }),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  void _confirmLogout(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.read<AuthBloc>().add(const AuthLogoutRequested());
            },
            child: const Text('Sign Out', style: TextStyle(color: AppTheme.errorColor)),
          ),
        ],
      ),
    );
  }
}
