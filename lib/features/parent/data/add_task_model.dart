class AddTaskModel {
  final String id; // 👈 مهم جدًا
  final String title;
  final String category;
  final String subCategory;
  final String level;
  final int rewardPoints;

  AddTaskModel({
    required this.id,
    required this.title,
    required this.category,
    required this.subCategory,
    required this.level,
    required this.rewardPoints,
  });
}

final List<AddTaskModel> addTasks = [
  AddTaskModel(
    id: '1',
    title: 'Listen to someone politely',
    category: 'Emotional & Social',
    subCategory: 'Family Connection',
    level: 'Easy',
    rewardPoints: 10,
  ),
  AddTaskModel(
    id: '2',
    title: 'Share toys with friends',
    category: 'Emotional & Social',
    subCategory: 'Sharing',
    level: 'Medium',
    rewardPoints: 15,
  ),
  AddTaskModel(
    id: '3',
    title: 'Solve 5 additions',
    category: 'Academic',
    subCategory: 'Math',
    level: 'Easy',
    rewardPoints: 10,
  ),
  AddTaskModel(
    id: '4',
    title: 'Read 1 page',
    category: 'Academic',
    subCategory: 'Arabic',
    level: 'Medium',
    rewardPoints: 15,
  ),
  AddTaskModel(
    id: '5',
    title: 'Clean your room',
    category: 'Behavior',
    subCategory: 'Clean-up',
    level: 'Medium',
    rewardPoints: 20,
  ),
  AddTaskModel(
    id: '6',
    title: 'Organize school bag',
    category: 'Behavior',
    subCategory: 'Personal Hygiene',
    level: 'Easy',
    rewardPoints: 10,
  ),
  AddTaskModel(
    id: '8',
    title: 'Listen to someone politely',
    category: 'Emotional & Social',
    subCategory: 'Family Connection',
    level: 'Easy',
    rewardPoints: 10,
  ),
  AddTaskModel(
    id: '9',
    title: 'Share toys with friends',
    category: 'Emotional & Social',
    subCategory: 'Sharing',
    level: 'Medium',
    rewardPoints: 15,
  ),
  AddTaskModel(
    id: '10',
    title: 'Solve 5 additions',
    category: 'Academic',
    subCategory: 'Math',
    level: 'Easy',
    rewardPoints: 10,
  ),
  AddTaskModel(
    id: '11',
    title: 'Read 1 page',
    category: 'Academic',
    subCategory: 'Arabic',
    level: 'Medium',
    rewardPoints: 15,
  ),
  AddTaskModel(
    id: '12',
    title: 'Clean your room',
    category: 'Behavior',
    subCategory: 'Clean-up',
    level: 'Medium',
    rewardPoints: 20,
  ),
  AddTaskModel(
    id: '6',
    title: 'Organize school bag',
    category: 'Behavior',
    subCategory: 'Personal Hygiene',
    level: 'Easy',
    rewardPoints: 10,
  ),
];
