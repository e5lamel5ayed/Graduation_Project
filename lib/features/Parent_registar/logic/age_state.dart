part of 'age_cubit.dart';

class AgeState {
  final double progress;
  final int? selectedAge;

  const AgeState({this.progress = 0.6, this.selectedAge});

  AgeState copyWith({double? progress, int? selectedAge}) {
    return AgeState(
      progress: progress ?? this.progress,
      selectedAge: selectedAge ?? this.selectedAge,
    );
  }
}
