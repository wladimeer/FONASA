export default function (kids, youngs, olds) {
  const array = [];

  kids.forEach((value) => {
    const [id, heightWeightRatio, name, yearOld, historyNumber] = value;

    if (yearOld >= 1 && yearOld <= 5) {
      array.push({ id, priority: heightWeightRatio + 3, historyNumber, yearOld, name });
    }

    if (yearOld >= 6 && yearOld <= 12) {
      array.push({ id, priority: heightWeightRatio + 2, historyNumber, yearOld, name });
    }

    if (yearOld >= 13 && yearOld <= 15) {
      array.push({ id, priority: heightWeightRatio + 1, historyNumber, yearOld, name });
    }
  });

  youngs.forEach((value) => {
    const [id, smoker, smokerYears, name, yearOld, historyNumber] = value;

    if (smoker == 1) {
      array.push({ id, priority: Math.round(smokerYears / 4 + 2), historyNumber, yearOld, name });
    } else {
      array.push({ id, priority: 2, name, yearOld, historyNumber });
    }
  });

  olds.forEach((value) => {
    const [id, assignedDiet, name, yearOld, historyNumber] = value;

    if (assignedDiet == 1 && yearOld >= 60 && yearOld <= 100) {
      array.push({ id, priority: Math.round(yearOld / 20 + 4), name, yearOld, historyNumber });
    } else {
      array.push({ id, priority: Math.round(yearOld / 30 + 3), name, yearOld, historyNumber });
    }
  });

  return array.map(({ id, name, priority, yearOld, historyNumber }) => ({
    id,
    risk:
      yearOld >= 41
        ? Number(((yearOld * priority) / 100 + 5.3).toFixed(1))
        : Number(((yearOld * priority) / 100).toFixed(1)),
    historyNumber,
    priority,
    yearOld,
    name
  }));
}
