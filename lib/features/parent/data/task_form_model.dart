class TaskFormModel {
  final String? category;
  final String? subCategory;
  final String? level;

  const TaskFormModel({
    this.category,
    this.subCategory,
    this.level,
  });

  TaskFormModel copyWith({
    String? category,
    String? subCategory,
    String? level,
  }) {
    return TaskFormModel(
      category: category ?? this.category,
      subCategory: subCategory ?? this.subCategory,
      level: level ?? this.level,
    );
  }
}
