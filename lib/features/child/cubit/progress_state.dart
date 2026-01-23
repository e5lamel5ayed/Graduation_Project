import 'package:equatable/equatable.dart';

class ProgressState extends Equatable {
  final int totalPoints;
  final int goalPoints;
  final bool showCelebration;

  const ProgressState({
    required this.totalPoints,
    required this.goalPoints,
    required this.showCelebration,
  });

  ProgressState copyWith({
    int? totalPoints,
    int? goalPoints,
    bool? showCelebration,
  }) {
    return ProgressState(
      totalPoints: totalPoints ?? this.totalPoints,
      goalPoints: goalPoints ?? this.goalPoints,
      showCelebration: showCelebration ?? this.showCelebration,
    );
  }

  @override
  List<Object?> get props => [totalPoints, goalPoints];
}