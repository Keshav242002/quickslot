import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/repositories/venue_repository.dart';
import '../../data/repositories/booking_repository.dart';
import '../blocs/venue/venue_bloc.dart';
import '../blocs/booking/booking_bloc.dart';
import 'venue_list_screen.dart';
import 'my_bookings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  void _switchTab(BuildContext ctx, int index) {
    setState(() => _currentIndex = index);
    if (index == 1) {
      ctx.read<BookingBloc>().add(const BookingFetchRequested());
    }
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (ctx) => VenueBloc(ctx.read<VenueRepository>()),
        ),
        BlocProvider(
          create: (ctx) => BookingBloc(ctx.read<BookingRepository>()),
        ),
      ],
      child: Builder(
        builder: (ctx) => Scaffold(
          body: IndexedStack(
            index: _currentIndex,
            children: [
              VenueListScreen(
                onBookingSuccess: () => _switchTab(ctx, 1),
              ),
              MyBookingsScreen(
                onBrowseVenues: () => _switchTab(ctx, 0),
              ),
            ],
          ),
          bottomNavigationBar: Container(
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.white.withAlpha(13)),
              ),
            ),
            child: BottomNavigationBar(
              currentIndex: _currentIndex,
              onTap: (index) => _switchTab(ctx, index),
              items: const [
                BottomNavigationBarItem(
                  icon: Icon(Icons.sports_rounded),
                  label: 'Venues',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.event_note_rounded),
                  label: 'My Bookings',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
