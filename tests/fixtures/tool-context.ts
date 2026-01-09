// tests/fixtures/tool-context.ts
import {
  AgentRole,
  IdentityStrength,
  PrincipalType,
  ToolAction,
  type CapabilityToken,
  type AgentIdentity,
} from '@/lib/guardrails/tool/tool-access.guardrail';

export function createAgentIdentity(
  overrides: Partial<AgentIdentity> = {}
): AgentIdentity {
  return {
    agentId: 'agent-1',
    agentType: PrincipalType.AGENT,
    agentRole: AgentRole.ADMIN,
    ownerTeam: 'core',
    purpose: 'testing',
    creationTime: new Date(),
    identityStrength: IdentityStrength.MFA_VERIFIED,
    ...overrides,
  };
}

export function createCapabilityToken(
  overrides: Partial<CapabilityToken> = {}
): CapabilityToken {
  return {
    tokenId: 'token-1',
    agentId: 'agent-1',
    toolName: 'db.write',
    allowedActions: [ToolAction.WRITE],
    constraints: {},
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 60_000),
    ...overrides,
  };
}

export function createToolAccessContext(
  overrides: Partial<any> = {}
) {
  return {
    toolName: 'db.write',
    toolArgs: { table: 'users' },
    agentIdentity: createAgentIdentity(),
    capabilityToken: createCapabilityToken(),
    runtimeContext: {
      sessionId: 'session-1',
      environment: 'prod',
      recentToolCalls: [],
      riskScore: 0.1,
      timestamp: new Date(),
    },
    ...overrides,
  };
}
