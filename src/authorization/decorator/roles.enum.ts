export enum AgenciaLocation {
  // PARAM = 'param',
  QUERY = 'query',
  BODY = 'body',
}

export enum RoleMatchingMode {
  /**
   * Match all roles
   */
  ALL = 'all',

  /**
   * Match any roles
   */
  ANY = 'any',
}

export enum RoleMerge {
  /**
   * Overrides roles if defined both controller and handlers, with controller taking over.
   */
  OVERRIDE = 0,
  /**
   * Merges all roles from both controller and handlers.
   */
  ALL = 1,
}
