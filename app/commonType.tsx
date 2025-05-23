interface Choice {
  value: string | number;
  label: string;
}

interface CourseTimeslotData {
    [courseCode: string]: string; // e.g., "HKP_001": "2025/05/08_AM"
}

interface appTypeChoicesItem {
  value: string,
  label: string,
  labelChn: string,
  labelEng: string,
  theme: Choice[],
  timeslot: CourseTimeslotData,
  ppl: { 
    min: number, 
    max: number
  },
  page?: number,
}

export type {CourseTimeslotData, Choice, appTypeChoicesItem}