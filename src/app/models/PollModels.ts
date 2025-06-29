export class PollOption {
  constructor(
    public id: string = "",
    public pollId: string = "",
    public optionText: string = "",
    public voteCount: number = 0,
    public isDeleted: boolean = false
  ) {}
}

export class PollModel {
  constructor(
    public id: string = "",
    public title: string = "",
    public description: string = "",
    public createdByEmail: string = "",
    public startDate: string = "",
    public endDate: string = "",
    public isDeleted: boolean = false,
    public poleFileId: string = "",
    public pollOptions: PollOption[] = []
  ) {}
}

export class PollResponseItemModel {
  constructor(
    public poll: PollModel = new PollModel(),
    public pollOptions: PollOption[] = [],
    public voteTime?: string | null
  ) {}
}

export class PollQueryDto {
  constructor(
    public searchTerm?: string,
    public sortBy?: string,
    public sortDesc?: boolean,
    public startDateFrom?: string,
    public startDateTo?: string,
    public page: number = 1,
    public pageSize: number = 10,
    public createdByEmail?: string,
    public VoterId?: string,
    public ForVoting: boolean = false
  ) {}
}

export class PollApiResponse {
  constructor(
    public data: {
      data: {
        $values: PollResponseItemModel[];
      };
      pagination: {
        totalRecords: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    } = {
      data: { $values: [] },
      pagination: { totalRecords: 0, page: 1, pageSize: 10, totalPages: 0 }
    }
  ) {}
}
