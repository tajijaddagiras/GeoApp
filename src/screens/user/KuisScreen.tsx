import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { getSoalByMateriId, updateProgress } from '../../services/firebaseService';
import { useAuthStore } from '../../store/authStore';
import { Soal } from '../../types';

interface KuisScreenProps {
  route: any;
  navigation: any;
}

export const KuisScreen: React.FC<KuisScreenProps> = ({ route, navigation }) => {
  const { materiId } = route.params;
  const { user } = useAuthStore();
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    loadSoal();
  }, [materiId]);

  useEffect(() => {
    if (soalList.length > 0 && !showResult && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [soalList, showResult, timeLeft]);

  const loadSoal = async () => {
    try {
      setLoading(true);
      const data = await getSoalByMateriId(materiId);
      if (data.length === 0) {
        Alert.alert('Info', 'Belum ada soal untuk materi ini', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        return;
      }
      setSoalList(data);
    } catch (error) {
      console.error('Load soal error:', error);
      Alert.alert('Error', 'Gagal memuat soal');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (jawaban: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: jawaban,
    });
  };

  const handleNext = () => {
    if (currentIndex < soalList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correctCount = 0;
    soalList.forEach((soal, index) => {
      if (selectedAnswers[index] === soal.jawabanBenar) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / soalList.length) * 100);
    setScore(finalScore);
    setShowResult(true);

    // Update progress
    if (user?.id) {
      try {
        await updateProgress(user.id, materiId, {
          status: 'completed',
          skor: finalScore,
        });
      } catch (error) {
        console.error('Update progress error:', error);
      }
    }
  };

  const currentSoal = soalList[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercentage = (answeredCount / soalList.length) * 100;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.deepTeal} />
      </View>
    );
  }

  if (showResult) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hasil Kuis</Text>
        </View>
        <ScrollView style={styles.content} contentContainerStyle={styles.resultContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{score}</Text>
            <Text style={styles.scoreLabel}>dari 100</Text>
          </View>

          <Text style={styles.resultTitle}>
            {score >= 80 ? '🎉 Luar Biasa!' : score >= 60 ? '👍 Bagus!' : '💪 Terus Belajar!'}
          </Text>
          <Text style={styles.resultSubtitle}>
            Kamu menjawab {answeredCount} dari {soalList.length} soal
          </Text>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Jawaban Benar</Text>
              <Text style={[styles.summaryValue, { color: Colors.successGreen }]}>
                {Math.round((score / 100) * soalList.length)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Jawaban Salah</Text>
              <Text style={[styles.summaryValue, { color: Colors.alertRed }]}>
                {soalList.length - Math.round((score / 100) * soalList.length)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Waktu Tersisa</Text>
              <Text style={styles.summaryValue}>{formatTime(timeLeft)}</Text>
            </View>
          </Card>

          <Button
            title="Kembali ke Dashboard"
            onPress={() => navigation.navigate('Dashboard')}
            style={styles.actionButton}
          />
          <Button
            title="Tulis Jurnal Refleksi"
            onPress={() => navigation.navigate('Jurnal')}
            variant="secondary"
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kuis</Text>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>⏱️ {formatTime(timeLeft)}</Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Soal {currentIndex + 1} dari {soalList.length} • {answeredCount} dijawab
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.questionNumber}>Soal {currentIndex + 1}</Text>
          <Text style={styles.questionText}>{currentSoal.pertanyaan}</Text>

          <View style={styles.optionsContainer}>
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionKey = `jawaban${option}` as keyof Soal;
              const optionText = currentSoal[optionKey] as string;
              if (!optionText) return null;

              const isSelected = selectedAnswers[currentIndex] === option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  onPress={() => handleSelectAnswer(option)}
                >
                  <View
                    style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}
                  >
                    <Text style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>
                      {option}
                    </Text>
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {optionText}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <View style={styles.navigationContainer}>
          <Button
            title="← Sebelumnya"
            onPress={handlePrevious}
            variant="secondary"
            disabled={currentIndex === 0}
            style={styles.navButton}
          />
          {currentIndex === soalList.length - 1 ? (
            <Button
              title="Selesai"
              onPress={() => {
                Alert.alert(
                  'Selesaikan Kuis',
                  `Kamu sudah menjawab ${answeredCount} dari ${soalList.length} soal. Yakin ingin selesai?`,
                  [
                    { text: 'Batal', style: 'cancel' },
                    { text: 'Selesai', onPress: handleSubmit },
                  ]
                );
              }}
              style={styles.navButton}
            />
          ) : (
            <Button
              title="Selanjutnya →"
              onPress={handleNext}
              style={styles.navButton}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.creamWhite,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.mustard,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
  },
  backIcon: {
    fontSize: 28,
    color: Colors.earthBrown,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    textAlign: 'center',
  },
  timerBadge: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    fontSize: Typography.sizes.subheading,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.warmSand,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.successGreen,
  },
  progressText: {
    fontSize: Typography.sizes.caption,
    color: Colors.earthBrown,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  questionNumber: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.deepTeal,
    marginBottom: 8,
  },
  questionText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.earthBrown,
    lineHeight: 24,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.creamWhite,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
  },
  optionButtonSelected: {
    backgroundColor: Colors.softBlue + '20',
    borderColor: Colors.deepTeal,
  },
  optionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionCircleSelected: {
    backgroundColor: Colors.deepTeal,
  },
  optionLetter: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.charcoalText,
  },
  optionLetterSelected: {
    color: Colors.white,
  },
  optionText: {
    flex: 1,
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
    lineHeight: 22,
  },
  optionTextSelected: {
    color: Colors.earthBrown,
    fontWeight: Typography.weights.medium,
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  navButton: {
    flex: 1,
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.successGreen + '20',
    borderWidth: 8,
    borderColor: Colors.successGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: Typography.weights.bold,
    color: Colors.successGreen,
  },
  scoreLabel: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
  },
  resultTitle: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
    marginBottom: 32,
  },
  summaryCard: {
    width: '100%',
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  summaryLabel: {
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
  },
  summaryValue: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
  },
  actionButton: {
    width: '100%',
    marginBottom: 12,
  },
});
