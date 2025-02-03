export class Filters {

  public static onlyEnabled(list: any[]) {
    try {
      return list.filter(i => i.enabled);
    } catch (error) {
      return list;
    }
  }

}
// export declare interface OnDestroy {
//   /**
//    * A callback method that performs custom clean-up, invoked immediately
//    * before a directive, pipe, or service instance is destroyed.
//    */
//   ngOnDestroy(): void;
// }